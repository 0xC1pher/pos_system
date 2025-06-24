<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import { faArrowRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import { checkoutLines, checkoutTotal, product } from '@/stores/productStore'
	import { currency } from '@/tools/variables'
	import { getStorage, getStorageJson, formatNumber2DecDot } from '@/tools/functions'
	import ProductItemTrash from './ProductItemTrash.svelte'

	export let prod, key, productViewOpen
	let sendTrash = false
	let erased = false
	let erasing = false

	// console.log({ prod }, key)

	const checkoutListId = getStorage('checkoutList') || null

	// console.log('ProductItemList', $checkoutLines)

	let quantity = prod.quantity
	const productName = prod.variant.name
	const productImage = prod.variant.media[0]?.url || ''
	const productPrice = prod.totalPrice.net.amount
	const productVariantId = prod.variant.id
	const checkoutLine = prod.id

	const eraseProduct = async () => {
		console.log('eraseProduct', { checkoutListId, checkoutLine, productName, key })
		try {
			erasing = true
			const response = await product.updateCheckoutLine(checkoutListId, checkoutLine, 0)
			console.log('eraseProduct', { response })
			const checkoutListData = await product.loadCheckoutComplete(checkoutListId)
			console.log('checkoutListData', { checkoutListData })
			$checkoutTotal = await checkoutListData.checkout.totalPrice.gross.amount
			// $checkoutLines = await checkoutListData.checkout.lines
			$checkoutLines.splice(key, 1)
			const lines = $checkoutLines.length
			erased = false
			erasing = false
			sendTrash = false
			if (lines == 0) {
				$goto(`/products`)
			} else {
				$goto(`/products/reList`)
			}
		} catch (error) {
			console.log('calcCheckoutTotal', { error })
		}
	}
	// $: console.log('product: ' + key, erased)
</script>

<div class="product-item" class:product-erased={erased}>
	<div class="product-image">
		<img src={productImage} alt="" />
	</div>
	<div class="product-info">
		<div class="product-name">{productName}</div>
		<div class="product-quantity">
			<!-- <Quantity bind:quantity size="2" /> -->
			<button
				class="quantity-change"
				on:click={() => {
					productViewOpen(prod, key)
				}}
			>
				Cantidad >
			</button>
			<div class="quantity-value">
				{quantity}
			</div>
		</div>
		<div class="product-bottom">
			<div class="product-price">
				<span class="price-currency">{currency}</span>
				<span class="price-amount">{formatNumber2DecDot(productPrice)}</span>
			</div>
			<div class="product-remove">
				<button class="button-hidden" on:click={() => (sendTrash = true)}>
					<Fa icon={faTrash} color="darkred" size="1.5x" />
				</button>
			</div>
		</div>
	</div>

	<!-- @ erase product from checkout modal window -->
	{#if sendTrash}
		<ProductItemTrash {productName} {eraseProduct} bind:sendTrash {erasing} />
	{/if}
</div>
