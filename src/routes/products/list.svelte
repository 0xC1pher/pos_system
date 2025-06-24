<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import { checkoutTotal, product } from '@/stores/productStore'
	import ProductList from '@/components/product/ProductList.svelte'
	import Fa from 'svelte-fa'
	import { faPlus, faPlusCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
	import { currency } from '@/tools/variables'
	import { formatNumber2DecDot, getStorage, editMode } from '@/tools/functions'

	const orderPayment = getStorage('order-payment')
	const checkoutList = getStorage('checkoutList')
	let orderId = ''
	let mutando = false

	let jump = ''
	let textButton = ''
	// if edit checkout is active, the user can edit the checkout
	let editing = editMode()
	if (editing) {
		jump = '/cashRegister'
		textButton = 'SALIR'
	} else {
		jump = '/checkout'
		textButton = 'CONTINUAR'
	}

	const wayout = async () => {
		if (editing) {
			textButton = 'MUTANDO'
			mutando = true
			try {
				const response1 = await product.updateBillingAddress(checkoutList)
				console.log('updateBillingAddress', { response1 })
				const responseShipping = await product.updateShippingMethod(checkoutList)
				console.log('updateShippingMethod', { responseShipping })
				const response2 = await product.orderCreateFromCheckout(checkoutList)
				console.log('orderCreateFromCheckout', { response2 })
				orderId = response2.orderCreateFromCheckout.order.id
				console.log({ orderId })
				const confirmOrderResponse = await product.confirmOrder(orderId)
				console.log('confirmOrder', { confirmOrderResponse })
				await $goto('/cashRegister')
			} catch (error) {
				console.error(error)
			}
		} else {
			$goto('/checkout')
		}
	}
</script>

<div class="product-list-container">
	<ProductList />
	<div class="product-bottom-container">
		<div class="product-list-total">
			<div class="total-text">Total:</div>
			<div class="total-value">
				<span class="price-currency">{currency}</span>
				<span class="price-amount">
					{formatNumber2DecDot($checkoutTotal)}
				</span>
			</div>
			<div class="button-add">
				<button class="add-product" on:click={() => $goto('/products')}>
					<Fa icon={faPlus} size="2x" />
				</button>
			</div>
		</div>

		<div class="product-confirm">
			<button class="button button-green" on:click={wayout}>
				{textButton}
				{#if mutando}
					&nbsp;&nbsp;
					<Fa icon={faSpinner} size="1.3x" spin />
				{/if}
			</button>
		</div>
	</div>
</div>
