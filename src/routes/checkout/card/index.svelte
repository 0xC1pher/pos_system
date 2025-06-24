<script>
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '@roxi/routify'
	import { checkoutListId, product, checkoutTotal } from '@/stores/productStore'
	import { vars, currency } from '@/tools/variables'
	import { printCurrentDateTime, getStorage, getRole, keepInStore, cleanLocalStorage } from '@/tools/functions'
	import { Jumper } from 'svelte-loading-spinners'
	import CheckoutTotals from '@/components/product/CheckoutTotals.svelte'
	import { backLink } from '@/stores/generalStore'

	$backLink = ''

	const dateTime = printCurrentDateTime()

	let orderId = getStorage('attenpo-order-id')

	let orderPaid = false

	const userRole = getRole()
	const mode = userRole == 'client' ? 'self-checkout' : getStorage('service')

	const checkoutId = getStorage('checkoutList')

	onDestroy(() => {
		clearInterval(interval)
	})

	/**
	 * Check payment status of the checkoutId
	 */
	const checkOrderStatus = async () => {
		let response
		try {
			if (mode === 'self-checkout') {
				// use checkoutId as externalReference
				response = await product.getOrderPaymentStatus(checkoutId)
				orderId = response.order.id
				keepInStore('attenpo-order-id', orderId)
			} else {
				response = await product.getOrder(orderId)
			}

			console.log('getOrderPaymentStatus', response)
			// const payStatus = response.order.paymentStatus || ''
			// const isPaid = response.order.isPaid
			const isPaid = response?.order?.isPaid ?? false
			// if (payStatus && payStatus == 'FULLY_CHARGED') {
			if (isPaid) {
				// const orderId = response.order.id
				// keepInStore('attenpo-order-id', orderId)
				// keepInStore('payment-type', 'card')
				clearInterval(interval)
				orderPaid = true
				/**
				 * si es admin regresa al escanneo de usuario
				 * si es usuario pregunta si quiere factura
				 */
				if (userRole == 'admin') {
					$goto('/cashRegister/checkoutPaid')
				} else {
					$goto('/order-paid/control')
				}
			}
		} catch (error) {
			console.log('checkOrderStatus', error.message)
			throw error
		}
	}

	let interval
	interval = setInterval(() => {
		checkOrderStatus()
		console.log('chequeando')
	}, vars.checkingDelay)

	const finishShopping = () => {
		cleanLocalStorage()
		clearInterval(interval)
		$goto('/products')
	}
</script>

<!-- <button class="button" on:click={sendPaymentIntent}>Pagar</button> -->

<!-- <button class="button" on:click={finishShopping}>Finalizado</button> -->

<div class="card-container">
	<div class="seccion-card">Pago con tarjeta</div>
	<div class="card-image">
		<img src="/images/cards.svg" alt="" />
	</div>
	<div class="instruct-card">
		{#if userRole == 'admin' && userRole}
			<!-- Esperando que se realice el pago -->
			ESPERANDO QUE SE REALICE<br />EL PAGO EN LA TERMINAL
		{:else}
			Acércate a una terminal para abonar<br />con tu tarjeta de crédito o débito
		{/if}
	</div>
	<div class="waiting">
		{#if !orderPaid}
			<!-- <Jumper size="260" color="#d26c2b" unit="px" duration="1s" /> -->
		{/if}
	</div>
	<CheckoutTotals />
</div>
