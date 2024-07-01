<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';

	export let product: Product;
	export let priceHistory: PriceHistory[];
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const data = {
			labels: priceHistory
				.flatMap((h) => h.priceHistory.map((a) => a.timestamp))
				.sort((a, b) => a.getTime() - b.getTime())
				.map((d) => d.toLocaleDateString()),
			datasets: priceHistory.map((h) => ({
				label: new URL(h.url).host,
				data: h.priceHistory.map(({ price, timestamp }) => ({
					x: timestamp.toLocaleDateString(),
					y: price
				}))
			})),
			options: {
				scales: {
					x: {
						type: 'time',
						time: {
							unit: 'week'
						}
					}
				}
			}
		};

		new Chart(canvas, {
			type: 'line',
			data: data
		});
	});
</script>

<div class="card m-3">
	<div class="card-header">{product.name}</div>
	<div class="card-body">
		<p class="card-text">{product.description}</p>
	</div>
	<div class="card-body text-bg-light m-3">
		{#if priceHistory.length}
			<canvas bind:this={canvas}></canvas>
		{:else}
			<h2 class="text-center">Ainda não há preços disponíveis</h2>
		{/if}
	</div>
</div>
