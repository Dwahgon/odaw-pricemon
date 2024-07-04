<script lang="ts">
	import FormAlert from '$lib/components/form-alert.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="m-3">
	{#if form?.error}
		<FormAlert formAction={form} />
	{/if}
	<div class="card mx-auto my-4" style="width: 18rem;">
		<h3 class="card-header">Cadastro</h3>
		<ul class="list-group list-group-flush">
			<li class="list-group-item">
				<form method="POST">
					<div class="mb-3">
						<label for="username" class="form-label">Nome do usuário</label>
						<input
							type="text"
							class="form-control"
							id="username"
							name="username"
							placeholder="Gustavo Macedo"
							maxlength="50"
							required
						/>
					</div>
					<div class="mb-3">
						<label for="email" class="form-label">Endereço e-mail</label>
						<input
							type="email"
							class="form-control"
							id="email"
							name="email"
							placeholder="exemplo@email.com"
							maxlength="50"
							required
						/>
					</div>
					<div class="mb-3">
						<label for="password" class="form-label">Senha</label>
						<input type="password" class="form-control" id="password" name="password" required />
					</div>
					<div class="mb-3">
						<label for="confirm-password" class="form-label">Confirmar senha</label>
						<input
							type="password"
							class="form-control"
							id="confirm-password"
							name="confirm-password"
							required
						/>
					</div>
					<div class="d-flex flex-row justify-content-end">
						<input type="submit" class="btn btn-warning" value="Cadastrar" />
					</div>
				</form>
			</li>
		</ul>
	</div>
</div>
