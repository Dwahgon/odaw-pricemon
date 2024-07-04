<script lang="ts">
	import ProductCard from './dashboard/product-card.svelte';

	const demoProduct: Product = {
		name: 'Geladeira Eletrolux',
		description:
			'Geladeira Electrolux Frost Free Inverter 581L FlexiSpace 4 Portas Cor Inox Look (IQ8S)',
		urls: [
			'https://www.mercadolivre.com.br/geladeira-electrolux-iq8s-frost-free-inverter-581l-flexispace-4-portas-cor-inox-look-127v/p/MLB20795069',
			'https://www.magazineluiza.com.br/geladeira-electrolux-frost-free-inverter-581l-flexispace-4-portas-cor-inox-look-iq8s/p/jhahg4kfe7/ed/refr/'
		]
	};

	const randomPriceHistory = (n: number, min: number, max: number) =>
		Array(n)
			.fill(undefined)
			.map((v, i) => ({
				timestamp: new Date(Date.now() - (n - i) * 24 * 60 * 60 * 1000),
				price: min + (max - min) * Math.random()
			}));

	const demoPriceHistory: PriceHistory[] = [
		{
			url: 'https://www.mercadolivre.com.br/geladeira-electrolux-iq8s-frost-free-inverter-581l-flexispace-4-portas-cor-inox-look-127v/p/MLB20795069',
			priceHistory: randomPriceHistory(10, 6000, 7000)
		},
		{
			url: 'https://www.magazineluiza.com.br/geladeira-electrolux-frost-free-inverter-581l-flexispace-4-portas-cor-inox-look-iq8s/p/jhahg4kfe7/ed/refr/',
			priceHistory: randomPriceHistory(10, 6000, 7000)
		}
	];
</script>

<div class="d-flex flex-row justify-content-around align-items-center m-3">
	<h1 class="inria-serif-bold text-warning" style="font-size: 50pt">
		Monitore,<br />Compare,<br />Economize!
	</h1>
	<div>
		<ProductCard
			product={demoProduct}
			priceHistory={demoPriceHistory}
			selectedFilter={3}
			optionsDisabled={true}
		></ProductCard>
	</div>
</div>
