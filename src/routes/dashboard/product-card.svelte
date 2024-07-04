<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-date-fns';
	import { groupBy } from '$lib/utils';

	export let product: Product;
	export let priceHistory: PriceHistory[];
	export let selectedFilter: number = 0;
	let chart: Chart<'line', { x: string | boolean; y: number }[], string | boolean>;
	let canvas: HTMLCanvasElement;

	const FILTERS: [(d: Date) => boolean, (d: Date) => string][] = [
		[
			(d: Date) => Date.now() - 60 * 60 * 1000 < d.getTime(),
			(d: Date) => d.getHours() + ':' + d.getMinutes() + ':00'
		],
		[
			(d: Date) => Date.now() - 24 * 60 * 60 * 1000 < d.getTime(),
			(d: Date) => d.getHours() + ':00:00'
		],
		[
			(d: Date) => Date.now() - 7 * 24 * 60 * 60 * 1000 < d.getTime(),
			(d: Date) => new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(d)
		],
		[
			(d: Date) => Date.now() - 30 * 24 * 60 * 60 * 1000 < d.getTime(),
			(d: Date) => d.toLocaleDateString()
		],
		[
			(d: Date) => Date.now() - 12 * 30 * 24 * 60 * 60 * 1000 < d.getTime(),
			(d: Date) => new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(d)
		]
	];

	const createData = () => ({
		labels: priceHistory
			.flatMap((h) => h.priceHistory.map((a) => a.timestamp))
			.sort((a, b) => a.getTime() - b.getTime())
			.filter(FILTERS[selectedFilter][0])
			.map((d) => FILTERS[selectedFilter][1](d))
			.filter((vi, i, arr) => !arr.some((vj, j) => vi == vj && j > i)),
		datasets: priceHistory.map((h) => ({
			label: new URL(h.url).host,
			data: [
				...groupBy(
					h.priceHistory
						.filter((h) => FILTERS[selectedFilter][0](h.timestamp))
						.map(({ price, timestamp }) => ({
							x: FILTERS[selectedFilter][1](timestamp),
							y: price
						})),
					(p) => p.x
				).entries()
			].map(([x, xs]) => ({ x, y: xs.reduce((a, v) => a + v.y, 0) / xs.length }))
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
	});

	function updateChart() {
		if (!chart) return;
		const d = createData();
		console.log(d);
		chart.data = d;
		chart.update();
	}

	$: selectedFilter, updateChart();

	onMount(() => {
		chart = new Chart(canvas, {
			type: 'line',
			data: createData()
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
	<div class="card-footer d-flex flex-row">
		{#each product.urls as url}
			<a class="btn btn-warning m-1" href={url}>{new URL(url).hostname}</a>
		{/each}
	</div>
</div>
