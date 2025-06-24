<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'

	import { Jumper } from 'svelte-loading-spinners'
	import { currency } from '@/tools/variables'
	import { product } from '@/stores/productStore'
	import { payment } from '@/stores/paymentsStore'
	import { getStorage, getRole } from '@/tools/functions'
	import ProductItemViewTxt from '@/components/product/ProductItemsView.svelte'

	// let orderListData = []
	let orderTotal = 0
	let lines = 0
	let linesDetail = []
	let products = 0
	let orderError = false
	let errorMessage = ''
	let efectivo
	let calculating = false
	let cashReturn = 0
	let orderId

	const userRole = getRole()

	let pagando = false
	let checkout = []

	let inputRef
	let user = ''

	onMount(() => {
		inputRef.focus()
	})

	const checkoutList = getStorage('checkoutList')
	console.log('checkout', checkoutList)
	user = getStorage('clientName').split('_')[1]

	const loadCheckout = async () => {
		try {
			const response = await product.loadCheckout(checkoutList)
			checkout = response
			console.log(checkout)
			lines = response.checkout.lines.length
			linesDetail = response.checkout.lines
			products = counter(linesDetail)
			orderTotal = response.checkout.totalPrice.net.amount
			console.log({ lines, linesDetail, orderTotal, products })
		} catch (error) {
			console.error(error)
		}
	}
	loadCheckout()

	const counter = (list) => {
		let total = 0
		const summ = list.map((prod) => {
			// console.log(prod.quantity)
			total += prod.quantity
		})
		return total
	}

	/**
	 * TODO: controlar si el checkout existe o si ya fue pagado
	 */

	$: cashReturn = (efectivo || 0) - orderTotal
	$: console.log({ cashReturn })

	const setPaid = async () => {
		pagando = true
		try {
			const response1 = await product.updateBillingAddress(checkoutList)
			console.log({ response1 })
			const response = await payment.sendPaymentIntentCash(checkoutList, orderTotal)
			console.log('handleCashPayment', response)
			if (response.status === 200) {
				userRole == 'admin' ? $goto('/cashRegister/checkoutPaid') : $goto('/order-paid')
			} else {
				errorMessage = 'Hubo un error al procesar la compra'
				orderError = true
			}
			pagando = false
		} catch (error) {
			console.error('Error:', error)
		}
		// console.log('pagado')
	}
</script>

<div class="section-name">Detalle de la compra</div>

<div class="cash-payment-container">
	<!-- {#await checkoutListData} -->
	<!-- <Jumper size="30" color="#d26c2b" unit="px" duration="1s" /> -->
	<!-- {:then value} -->

	{#if !orderError}
		<div class="product-list-container-txt">
			<div class="product-items">
				{#each linesDetail as prod, key}
					<ProductItemViewTxt {prod} {key} />
				{/each}
			</div>
		</div>

		<div class="cash-payment-data">
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Total a pagar</div>
				<div class="cash-payment-right">
					{currency}
					{orderTotal}
				</div>
			</div>
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Cantidad de productos</div>
				<div class="cash-payment-right">
					{products}
				</div>
			</div>
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Efectivo</div>
				<div class="cash-payment-right">
					{currency}
					<input type="number" bind:value={efectivo} placeholder="0" bind:this={inputRef} />
					<!-- on:input={calculate} -->
				</div>
			</div>
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Vuelto</div>
				<div class="cash-payment-right">
					{#if cashReturn >= 0}
						{currency}
						{cashReturn}
					{:else}
						Falta de efectivo
					{/if}
				</div>
			</div>
		</div>

		<div class="cash-payment-button">
			<button class="button button-green" class:disabled={cashReturn < 0} on:click={setPaid}>PAGADO</button>
		</div>
	{:else}
		<div class="cash-payment-data"></div>
		<div class="cash-payment-button">
			<button class="button button-red" on:click={() => $goto('/cashRegister/restarStateOrder')}>{errorMessage}</button>
		</div>
	{/if}

	{#if pagando}
		<div class="waiting">
			<Jumper size="260" color="#d26c2b" unit="px" duration="1s" />
		</div>
	{:else}
		<!-- else content here -->
	{/if}
	<!-- {:catch error} -->
	<!-- {() => console.log({ error })} -->
	<!-- {/await} -->
</div>

<style>
	/* Para todos los navegadores */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Para Firefox */
	input[type='number'] {
		border-radius: 5px;
		border: 1px solid gray;
		-moz-appearance: textfield;
	}
</style>
