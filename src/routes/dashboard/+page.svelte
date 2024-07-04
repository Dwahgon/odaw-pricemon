<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import ProductCard from './product-card.svelte';
	import { isUrlValid, parseUrlList } from '$lib/utils';
	import type { ActionData } from './$types';
	import FormAlert from '$lib/components/form-alert.svelte';
	import { validate } from '$lib/actions';
	import { SUPPORTED_VENDORS } from '$lib/constants';

	export let data: PageData;
	export let form: ActionData;

	let urlValue = '';
	let urls = '';
	let bootstrap: { Modal: any };
	let createProductForm: HTMLFormElement;
	let selectedFilter = 0;
	let productToDelete: Product;
	let createProductModal: HTMLDivElement;
	let deleteProductModal: HTMLDivElement;

	function addUrl() {
		if (!urlValue) return;
		urls = urls + `<${urlValue}>`;
		urlValue = '';
	}

	function removeUrl(url: string) {
		urls = urls.replace(`<${url}>`, '');
	}

	onMount(async () => {
		if (!browser) return;
		bootstrap = await import('bootstrap');
	});

	function showDeleteProductModal(product: Product) {
		productToDelete = product;
		bootstrap.Modal.getOrCreateInstance(deleteProductModal)?.show();
	}

	function reset() {
		createProductForm.reset();
		urls = '';
	}
</script>

<div class="d-flex flex-row">
	<div class="flex-grow-1 flex-basis-zero m-3">
		<select class="form-select" bind:value={selectedFilter}>
			<option value={0}>Última hora</option>
			<option value={1}>Último dia</option>
			<option value={2}>Última semana</option>
			<option value={3}>Último mês</option>
			<option value={4}>Último ano</option>
		</select>
	</div>
	<div class="flex-grow-1 d-flex flex-column flex-basis-zero">
		{#each data.userProducts as product}
			<ProductCard
				{product}
				priceHistory={data.priceHistory.get(product.id) || []}
				{selectedFilter}
				on:delete={() => showDeleteProductModal(product)}
			></ProductCard>
		{/each}
	</div>
	<div class="flex-grow-1 flex-basis-zero text-end m-3">
		<button
			type="button"
			class="btn btn-warning"
			data-bs-toggle="modal"
			data-bs-target="#newProductModal"
			on:click={reset}
		>
			Criar Produto
		</button>
	</div>
</div>

<form
	id="delete-product-form"
	method="post"
	action="?/deleteProduct"
	use:enhance={() =>
		async ({ result }) => {
			await applyAction(result);
			await invalidateAll();
			bootstrap.Modal.getOrCreateInstance(deleteProductModal)?.hide();
			document.querySelector('.modal-backdrop')?.remove();
			setTimeout(() => (document.body.style.overflow = 'auto'), 500);
		}}
>
	<input name="product-id" type="hidden" value={productToDelete?.id} />
</form>
<div
	class="modal fade"
	id="deleteProduct"
	tabindex="-1"
	role="dialog"
	aria-labelledby="deleteProductLabel"
	aria-hidden="true"
	bind:this={deleteProductModal}
>
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="deleteProductLabel">Apagar Produto</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				Você tem certeza que deseja apagar o produto <b>{productToDelete?.name}</b>?
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Fechar</button
				>
				<button type="submit" form="delete-product-form" class="btn btn-warning">Apagar</button>
			</div>
		</div>
	</div>
</div>

<div
	class="modal fade"
	id="newProductModal"
	tabindex="-1"
	aria-labelledby="newProductModalLabel"
	aria-hidden="true"
	bind:this={createProductModal}
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="newProductModalLabel">Criar Produto</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				{#if form?.error}
					<FormAlert formAction={form} />
				{/if}
				<form
					id="create-product-form"
					method="post"
					action="?/createProduct"
					bind:this={createProductForm}
					use:enhance={() =>
						async ({ result }) => {
							await applyAction(result);
							if (form?.error) return;

							await invalidateAll();
							bootstrap.Modal.getOrCreateInstance(createProductModal)?.hide();
							document.querySelector('.modal-backdrop')?.remove();
							setTimeout(() => (document.body.style.overflow = 'auto'), 500);
						}}
				>
					<input type="hidden" name="user-id" id="user-id" value={data.user?.id} />
					<div class="mb-3">
						<label for="name" class="form-label">Nome</label>
						<input
							type="text"
							class="form-control"
							id="name"
							name="name"
							placeholder="Geladeira"
							maxlength="50"
							required
						/>
					</div>
					<div class="mb-3">
						<label for="name" class="form-label">Descrição</label>
						<input
							type="text"
							class="form-control"
							id="description"
							name="description"
							placeholder="Geladeira 500L Inox"
							maxlength="100"
							required
						/>
					</div>
					<input type="hidden" name="urls" id="urls" bind:value={urls} />
				</form>
				<form on:submit|preventDefault={addUrl}>
					<div class="mb-3">
						<label for="name" class="form-label">URLs do Produto</label>
						<div class="input-group">
							<input
								type="url"
								class="form-control"
								maxlength="2048"
								placeholder="https://www.revendedoraexemplo.com/geladeira-inox-500l"
								use:validate={(v) =>
									!isUrlValid(v) || SUPPORTED_VENDORS.has(new URL(v).hostname)
										? ''
										: 'Este website não é suportado.'}
								bind:value={urlValue}
							/>
							<button class="btn btn-success" type="submit">
								<span class="material-symbols-outlined align-middle"> add </span>
							</button>
						</div>
					</div>
				</form>
				{#each parseUrlList(urls) as url}
					<div class="input-group mb-3">
						<input type="text" disabled class="form-control" value={url} />
						<button class="btn btn-danger" type="button" on:click={() => removeUrl(url)}>
							<span class="material-symbols-outlined align-middle"> delete </span>
						</button>
					</div>
				{/each}
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">Fechar</button
				>
				<button type="submit" form="create-product-form" class="btn btn-warning">Criar</button>
			</div>
		</div>
	</div>
</div>
