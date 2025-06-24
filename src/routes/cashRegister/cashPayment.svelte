<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import { currency, enviroment } from '@/tools/variables'
	import { product } from '@/stores/productStore'
	import { payment } from '@/stores/paymentsStore'
	import { getStorage, getRole, formatNumber2DecDot, keepInStore } from '@/tools/functions'
	import ProductItemsView from '@/components/product/ProductItemsView.svelte'
	import Fa from 'svelte-fa'
	import { faTimes, faSpinner, faCashRegister } from '@fortawesome/free-solid-svg-icons'
	import PhoneNumber from '@/components/PhoneNumber.svelte'
	import { DoubleBounce } from 'svelte-loading-spinners'
	import { backLink } from '@/stores/generalStore'
	// $backLink = '/checkout'

	const hiddenMode = getStorage('hidden-mode') || ''
	const service = getStorage('service') || ''
	const receiptPhoneNumber = getStorage('receiptPhoneNumber') || ''
	const orderPayment = getStorage('order-payment') || ''
	const orderConfirmed = getStorage('order-confirmed') || ''

	$backLink = '/checkout'
	let orderId = ''

	// let orderListData = []
	let orderTotal = 0
	let lines = 0
	let linesDetail = []
	let products = 0
	let orderError = false
	let errorMessage = ''
	let efectivo
	let cashReturn = 0
	let phone = ''

	let pagando = false
	let checkout = []

	// avoid to set shipping method in production
	// const setShippingMethod = enviroment == 'staging' || enviroment == 'localhost'
	const setShippingMethod = true

	let inputRef
	let user = ''
	onMount(() => {
		orderId = getStorage('attenpo-order-id') || ''
		console.log('orderId', orderId)
		loadPurchaseDetail()
		// if (inputRef) {
		// }
		// inputRef.focus()
		// inputRef.select()
	})

	const role = getRole()

	function handleFocus(event) {
		event.target.select()
	}

	const checkoutList = getStorage('checkoutList')
	console.log('checkout', checkoutList)
	console.log('orderId', orderId)
	console.log('orderPayment', orderPayment)

	user = getStorage('clientName').split('_')[1]

	let searchReceipt = false

	const loadPurchaseDetail = async () => {
		let response = {}
		try {
			// if (orderPayment == 'confirmed') {
			if (orderId != '') {
				console.log('assisted checkout', { checkoutList })
				console.log('assisted orderId', { orderId })
				console.log({ orderPayment })
				response = await product.getOrderComplete(orderId)
				console.log('getOrderComplete', { response })
				lines = response.order.lines.length
				linesDetail = response.order.lines
				console.log({ linesDetail })
				products = counter(linesDetail)
				orderTotal = response.order.total.gross.amount
				efectivo = orderTotal
				console.log({ lines, linesDetail, orderTotal, products })
			} else {
				// Self checkout or assisted checkout confirmation skipped
				console.log('self checkout', { checkoutList })
				response = await product.loadCheckoutComplete(checkoutList)
				console.log('loadCheckoutComplete', { response })
				lines = response.checkout.lines.length
				linesDetail = response.checkout.lines
				console.log({ linesDetail })
				products = counter(linesDetail)
				orderTotal = response.checkout.totalPrice.gross.amount
				efectivo = orderTotal
				console.log({ lines, linesDetail, orderTotal, products })
				phone = response.checkout.email.split('@')[0]
			}
			console.log('loadPurchaseDetail', { response }, { phone })
			searchReceipt = true
			setTimeout(() => {
				inputRef.focus()
			}, 500)
			// checkout = response
			// console.log(checkout)
		} catch (error) {
			console.error(error)
		}
	}

	const counter = (list) => {
		let total = 0
		const summ = list.map((prod) => {
			// console.log(prod.quantity)
			total += prod.quantity
		})
		return total
	}

	$: cashReturn = (efectivo || 0) - orderTotal
	$: console.log({ cashReturn })

	const setPaid = async () => {
		pagando = true
		try {
			let status
			// const response1 = await product.updateBillingAddress(checkoutList)
			// console.log({ response1 })
			let response
			if (orderPayment == 'confirmed') {
				console.log({ orderId, orderTotal })
				response = await payment.sendPaymentIntentCash(orderId, orderTotal)
				console.log('sendPaymentIntentCash order', { response })
				status = response.status === 200
			} else if (hiddenMode != '') {
				// if orderId was not created, create it
				if (orderId == '') {
					const response1 = await product.updateBillingAddress(checkoutList)
					console.log('updateBillingAddress', { response1 })
					if (setShippingMethod) {
						const responseShipping = await product.updateShippingMethod(checkoutList)
						console.log('updateShippingMethod', { responseShipping })
					}
					const response2 = await product.orderCreateFromCheckout(checkoutList)
					console.log('orderCreateFromCheckout', { response2 })
					orderId = response2.orderCreateFromCheckout.order.id
				}
				response = await product.confirmOrder(orderId)
				console.log('confirmOrder', { response })
				status = response.orderConfirm.errors.length == 0
				response = await payment.sendPaymentIntentCash(orderId, orderTotal, phone)
				status = response.status === 200
			} else {
				response = await payment.sendPaymentIntentCash(checkoutList, orderTotal, phone)
				console.log('sendPaymentIntentCash checkout', { response })
			}
			console.log('handleCashPayment', response)

			if (status) {
				$goto('/cashRegister/checkoutPaid')
			} else {
				errorMessage = 'Hubo un error al procesar la compra'
				orderError = true
			}
			pagando = false
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const cleanCash = () => {
		efectivo = ''
		inputRef.focus()
	}

	let showPhoneNumber = false
	let phoneNumber = ''
	let phoneNumberComplete = false
	const generateReceipt = () => {
		showPhoneNumber = true

		// TODO: generar recibo
		// TODO: agregar recibo a la lista de compras
		// TODO: enviar recibo a cliente
	}

	const savePhoneNumber = (number) => {
		keepInStore('receiptPhoneNumber', number)
	}

	const receiptBotton = hiddenMode == 'true' && service == 'assisted-checkout' && orderPayment != 'confirmed'
	$: console.log('receiptBotton', receiptBotton)
</script>

<div class="section-name">Detalle de la compra</div>
{#if !searchReceipt}
	<div class="spinner-confirm-waiting">
		<DoubleBounce size="200" unit="px" duration="2s" color="#d26c2b" />
	</div>
{:else}
	<div class="cash-payment-container">
		{#if !orderError}
			<ProductItemsView {linesDetail} />
			<div class="products-items-edit">
				<!-- if is assisted checkout the list cannot be edited -->
				<!-- {#if orderPayment != 'confirmed' || orderId == ''} -->
				{#if orderId == ''}
					<button class="button button-orange" on:click={() => $goto('/products/list')}>EDITAR PRODUCTOS</button>
				{/if}
				{#if receiptBotton}
					<button class="button button-gray" on:click={() => $goto('/cashRegister/order-confirm')}
						>SOLICITAR RECIBO</button
					>
					<!-- {#if showPhoneNumber} -->
					<!-- <PhoneNumber {phoneNumber} bind:phoneNumberComplete /> -->
					<!-- {:else} -->
					<!-- {/if} -->
				{/if}
			</div>
			<div class="cash-payment-data">
				<div class="cash-payment-doble">
					<div class="cash-payment-left">Total a pagar</div>
					<div class="cash-payment-right">
						<div class="total-currency">
							{currency}
						</div>
						<div class="total-amount">
							{formatNumber2DecDot(orderTotal)}
						</div>
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
						<div class="total-currency">
							{currency}
						</div>
						<input type="number" bind:value={efectivo} placeholder="0" bind:this={inputRef} on:focus={handleFocus} />
						<!-- on:input={calculate} -->
						<div class="clean">
							<button class="button-hidden" on:click={cleanCash}>
								<Fa icon={faTimes} />
							</button>
						</div>
					</div>
				</div>
				<div class="cash-payment-doble">
					<div class="cash-payment-left">Cambio</div>
					<div class="cash-payment-right">
						{#if cashReturn >= 0}
							<div class="total-currency">
								{currency}
							</div>
							<div class="total-amount">
								{formatNumber2DecDot(cashReturn)}
							</div>
						{:else}
							Falta de efectivo
						{/if}
					</div>
				</div>
			</div>

			<div class="cash-payment-button">
				<button class="button button-green" class:disabled={cashReturn < 0} on:click={setPaid} disabled={pagando}>
					{pagando ? 'PAGANDO' : 'RECIBIR PAGO'}
					<div class="pagando">
						{#if pagando}
							<Fa icon={faSpinner} size="1.3x" color="white" spin />
						{:else}
							<Fa icon={faCashRegister} size="1.3x" color="white" />
						{/if}
					</div>
				</button>
			</div>
		{:else}
			<div class="cash-payment-data"></div>
			<div class="cash-payment-button">
				<button class="button button-red" on:click={() => $goto('/cashRegister/restarStateOrder')}
					>{errorMessage}</button
				>
			</div>
		{/if}
	</div>
{/if}

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
