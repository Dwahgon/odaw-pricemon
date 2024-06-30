<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand inria-serif-bold fs-4 text-warning" href="/">Pricemon</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
			<div class="d-flex">
				{#if data.user}
					<form method="post" action="/?/logout">
						<a class="btn btn-warning mx-1" href="/dashboard">Dashboard</a>
						<input type="submit" class="btn btn-outline-warning mx-1" value="Sair" />
					</form>
				{:else}
					<a class="btn btn-outline-warning mx-1" href="login">Login</a>
					<a class="btn btn-warning mx-1" href="register">Cadastrar</a>
				{/if}
			</div>
		</div>
	</div>
</nav>

<slot></slot>
