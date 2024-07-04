<script lang="ts">
	import { FIELD_TRANSLATIONS } from '$lib/constants';
	import { onMount } from 'svelte';

	export let formAction;

	onMount(() => {
		if (formAction.error === 'internal-error') {
			console.error(JSON.parse(formAction.details));
		}
	});
</script>

<div class="alert alert-danger alert-dismissible fade show" role="alert">
	<strong>Erro!</strong>
	{#if formAction.error === 'field-missing'}
		O campo "{FIELD_TRANSLATIONS.get(formAction.details)}" não foi preenchido.
	{:else if formAction.error === 'password-confirm-doesnt-match'}
		Os campos "Senha" e "Confirmar senha" não conferem.
	{:else if formAction.error === 'access-denied'}
		Credenciais inválidos.
	{:else if formAction.error === 'internal-error'}
		Erro interno.
	{/if}
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
