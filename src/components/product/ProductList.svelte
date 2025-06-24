<script>
	import ReturnMarquee from '../ReturnMarquee.svelte'
	import { checkoutLines, checkoutListId, product } from '@/stores/productStore'
	import ProductItemList from '@/components/product/ProductItemList.svelte'
	import ProductItemView from '@/components/product/ProductItemView.svelte'
	import { goto } from '@roxi/routify'

	$: console.log('ProductList', $checkoutLines)

	let productView
	let productViewEnabled = false

	const productQtyEdit = (n) => {
		productView = $checkoutLines[n]
		productViewEnabled = true
	}

	const productViewClose = () => {
		productView = null
		productViewEnabled = false
	}

	let productViewKey = null
	const productViewOpen = (prod, key) => {
		productView = prod
		productViewEnabled = true
		productViewKey = key
	}

	/**
	 * If the user has no products in the cart, redirect to the products page
	 */
	// if ($checkoutLines.length == 0) {
	// $goto('/products')
	// }

	// console.log('ProductList', { checkoutLines })
</script>

<div class="section-name">Carrito de compras</div>

<div class="product-items-container">
	{#each $checkoutLines as prod, key}
		<ProductItemList {prod} {key} {productViewOpen} />
	{/each}
</div>

{#if productViewEnabled}
	<div class="product-list-view-container">
		<ProductItemView {productView} {productViewKey} {productViewClose} bind:productViewEnabled />
	</div>
{/if}
