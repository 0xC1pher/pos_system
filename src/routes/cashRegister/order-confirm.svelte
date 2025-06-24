<script>
	import { goto } from '@roxi/routify'
	import { onDestroy } from 'svelte'
	import {
		getStorage,
		getRole,
		keepInStore,
		formatoNumeroWhatsApp,
		cleanStore,
		formatNumber2DecDot,
	} from '@/tools/functions'
	import { fade } from 'svelte/transition'
	import { product } from '@/stores/productStore'
	import { payment } from '@/stores/paymentsStore'
	import { vars, enviroment } from '@/tools/variables'
	import { faPhoneAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import NotFound from '@/components/product/NotFound.svelte'
	import QrCode from '@/components/QrCode.svelte'
	import ErrorMessage from '@/components/ErrorMessage.svelte'
	import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
	import CheckoutTotals from '@/components/product/CheckoutTotals.svelte'
	import { DoubleBounce } from 'svelte-loading-spinners'
	import PhoneNumber from '@/components/PhoneNumber.svelte'
	import OrderTotals from '@/components/product/OrderTotals.svelte'
	import { backLink } from '@/stores/generalStore'

	const hiddenMode = getStorage('hidden-mode') || ''
	const service = getStorage('service') || ''
	const receiptPhoneNumber = getStorage('receiptPhoneNumber') || ''
	const total = getStorage('total-payment') || ''
	const paymentType = getStorage('payment-type') || ''
	let manualPhoneNumber = getStorage('manual-phone-number') || ''
	let orderConfirmed = getStorage('order-confirmed') || ''
	if (paymentType == 'cash') {
		if (hiddenMode == 'true') {
			$backLink = '/cashRegister/cashPayment'
		} else {
			$backLink = '/checkout'
		}
	} else {
		$backLink = '/checkout'
	}

	// const skipConfirmation = () => {
	// 	$goto('/checkout')
	// }

	// let phoneNumberForm = true
	let phoneNumber = ''
	let phoneNumberComplete = false
	// const phonumberShow = () => {
	// 	phoneNumberForm = !phoneNumberForm
	// 	if (!phoneNumberForm) {
	// 		phoneNumber = ''
	// 	}
	// 	phoneNumberComplete = false
	// }

	// avoid to set shipping method in production
	// const setShippingMethod = enviroment == 'staging' || enviroment == 'localhost'
	const setShippingMethod = true

	const WhatsAppAttenpo = vars.WhatsApp
	const userRole = getRole()

	let interval
	let WhatsAppLink = ''
	let errorMessage = ''
	let errorCode = ''
	let orderNumber = ''
	let orderId = getStorage('attenpo-order-id') || ''
	let creationError = false
	let showPhoneNumber = false
	let sendigPhoneNumber = false

	const checkoutId = getStorage('checkoutList')
	console.log('checkoutId', { checkoutId })
	const userCashier = getStorage('userCashRegister')
	const confirmLargeQty = getStorage('confirm-large-qty') || ''

	onDestroy(() => {
		clearInterval(interval)
	})

	const checkOrder = () => {
		interval = setInterval(() => {
			checkOrderStatus()
			console.log('chequeando')
		}, vars.checkingDelay)
	}

	const orderCreate = async () => {
		if (orderId == '') {
			try {
				const response1 = await product.updateBillingAddress(checkoutId)
				console.log('updateBillingAddress', { response1 })
				if (setShippingMethod) {
					const responseShipping = await product.updateShippingMethod(checkoutId)
					console.log('updateShippingMethod', { responseShipping })
				}
				const response2 = await product.orderCreateFromCheckout(checkoutId)
				console.log('orderCreateFromCheckout', { response2 })
				// const response3 = await product.updateOrderMetadata(orderId, 'cashier_name', userCashier)
				// console.log('updateOrderMetadata', { response3 })
				if (response2.orderCreateFromCheckout.errors.length > 0) {
					errorCode = response2.orderCreateFromCheckout.errors[0].code
					errorMessage = response2.orderCreateFromCheckout.errors[0].message
					creationError = true
				} else {
					orderNumber = response2.orderCreateFromCheckout.order.number
					orderId = response2.orderCreateFromCheckout.order.id
					WhatsAppLink = `https://wa.me/${WhatsAppAttenpo}?text=Confirma%20mi%20orden%20${orderNumber}`
					keepInStore('attenpo-order-id', orderId)
					keepInStore('attenpo-order-number', orderNumber)
					checkOrder()
				}

				// $goto('/cashRegister/order-paid')
			} catch (error) {
				console.error('orderCreateFromCheckout', { error })
				$goto('/cashRegister')
			}
		} else {
			orderNumber = getStorage('attenpo-order-number')
			WhatsAppLink = `https://wa.me/${WhatsAppAttenpo}?text=Confirma%20mi%20orden%20${orderNumber}`
			checkOrder()
		}
	}
	orderCreate()

	let customerId = ''
	const checkOrderStatus = async () => {
		try {
			const response = await product.getOrder(orderId)
			console.log('getOrderPaymentStatus response', { orderId }, { orderNumber }, response)
			const payStatus = response.order.paymentStatus
			const isPaid = response.order.isPaid
			const orderStatus = response.order.status
			if (orderStatus == 'UNFULFILLED') {
				clearInterval(interval)
				const orderId = response.order.id
				const phoneNumber = response.order.privateMetadata[0].value
				attachUsertoOrder()
				const response2 = await product.orderPrivateMetadata(orderId, 'confirm_method', 'order-confirmed')
				keepInStore('order-payment', 'confirmed')
				jumps()
			}
		} catch (error) {}
	}

	const attachUsertoOrder = async () => {
		if (phoneNumber == '') {
			phoneNumber = getStorage('phoneNumber')
		}
		let userEmail = phoneNumber.toLowerCase() + '@attenpo.shop'
		console.log('TTT', { phoneNumber, userEmail })

		const customerExists = await product.checkUserByEmail(userEmail)
		console.log('CHECK USER BY EMAIL', phoneNumber, userEmail, customerExists.user)
		if (!customerExists.user) {
			console.log('NO EXISTE', userEmail)
			userEmail = phoneNumber + '@attenpo.shop'
			const customer = await product.createCustomer(userEmail, 'user', '')
			console.log({ customer })
			customerId = customer.customerCreate.user.id
			console.log({ customerId })
		} else {
			customerId = customerExists.user.id
			console.log('EXISTE', { customerId })
		}
		const attached = await product.orderCustomerAttach(orderId, userEmail)
		console.log('Attach:', attached)
		if (attached.orderUpdate.errors.length > 0) {
			console.log('ERROR ATTACHING CUSTOMER TO ORDER', { attached })
		}
	}

	const jumps = () => {
		if (paymentType == 'cash') {
			$goto('/cashRegister/cashPayment')
		} else {
			$goto('/checkout/card/terminalSelector')
		}
	}

	const sendPaymentConfirmationManual = async () => {
		showPhoneNumber = true
		try {
			const response = await payment.sendPaymentHiddenConfirm(total, phoneNumber, orderNumber, paymentType)
			console.log('sendPaymentIntentCard order', { response })
			if (response.status === 200) {
				const response2 = await product.orderPrivateMetadata(orderId, 'confirm_method', 'send-confirmation-manuald')
				attachUsertoOrder()
				// wait for confirmation
			} else {
				errorMessage = 'Hubo un error al procesar la compra'
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const onlySendPhoneNumber = async () => {
		sendigPhoneNumber = true
		clearInterval(interval)
		try {
			// send phone number to order in private metadata customer_phone
			const response = await product.orderPrivateMetadata(orderId, 'customer_phone', phoneNumber)
			const response2 = await product.orderPrivateMetadata(orderId, 'confirm_method', 'only-send-phoneNumber')
			console.log('onlySendPhoneNumber order', { response })
			// set order as confirmed
			const responseConfirm = await product.confirmOrder(orderId)
			console.log('confirmOrder', { responseConfirm })
			if (responseConfirm.orderConfirm.order.status == 'UNFULFILLED') {
				attachUsertoOrder()
				// no wait for confirmation
				keepInStore('order-confirmed', 'true')
				// keepInStore('hidden-mode', 'true')
				// $goto('/cashRegister/cashPayment')
				jumps()
			} else {
				errorMessage = 'Hubo un error al procesar la compra'
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	// $: console.log({ showPhoneNumber })

	const jumpToCashPayment = hiddenMode == 'false'
	const jumpConfirmation = async () => {
		// $goto('/cashRegister/cashPayment')

		const response = await product.orderPrivateMetadata(orderId, 'customer_phone', 'no-confirmed')
		const response2 = await product.orderPrivateMetadata(orderId, 'confirm_method', 'jump-confirmation')

		// TODO: confirmo orden?
		// const responseConfirm = await product.confirmOrder(orderId)

		jumps()
	}
</script>

<div class="cash-container" transition:fade>
	<div class="seccion-cash">Confirmar Orden</div>
	{#if WhatsAppLink}
		<QrCode textToQR={WhatsAppLink} />

		<div class="instruct-cash">
			<div class="cash-whatsapp">
				<Fa icon={faWhatsapp} size="3x" color="green" />
			</div>
			<div class="instruct-text">
				Escanea el QR para confirmar<br />tu compra directamente<br />desde tu WhatsApp
				<!-- <br />Orden #{orderNumber} -->
			</div>
		</div>
		<!-- omly for cash payment -->
		<!-- {#if (hiddenMode == 'true' || confirmLargeQty == 'true') && paymentType == 'cash'} -->

		{#if !showPhoneNumber}
			<PhoneNumber bind:phoneNumber bind:phoneNumberComplete />
		{:else}
			<div class="show-phone-number">{phoneNumber}</div>
		{/if}
		<div class="phone-sending" transition:fade>
			{#if phoneNumberComplete}
				<!-- Send phone number and wait for confirmation -->
				<button
					class="button button-gray sending-button"
					on:click={sendPaymentConfirmationManual}
					disabled={showPhoneNumber}
				>
					{#if !showPhoneNumber}
						CONFIRMAR
					{:else}
						ESPERANDO CONFIRMACIÓN
						<Fa icon={faSpinner} size="1.3x" color="black" spin />
					{/if}
				</button>
				<!-- just send phone number, no confirmation is needed -->
				<button class="button button-gray sending-button" on:click={onlySendPhoneNumber} disabled={showPhoneNumber}>
					{#if !sendigPhoneNumber}
						SOLO ENVIAR
					{:else}
						ENVIANDO...
						<Fa icon={faSpinner} size="1.3x" color="black" spin />
					{/if}
				</button>
			{/if}
		</div>
		<!-- {/if} -->
		<OrderTotals {total} />
		{#if jumpToCashPayment && paymentType == 'cash'}
			<div class="skip-button">
				<button class="button button-orange" on:click={jumpConfirmation}>SALTAR CONFIRMACIÓN</button>
			</div>
		{/if}
	{:else}
		<div class="spinner-confirm-waiting">
			<DoubleBounce size="200" unit="px" duration="2s" color="#d26c2b" />
		</div>
	{/if}
	{#if creationError}
		<button class="button button-red" on:click={() => $goto('/cashRegister')}>No se pudo crear la orden</button>
	{/if}
</div>

<!-- <ErrorMessage {errorMessage} {errorCode} returnLink="/cashRegister" /> -->
<style>
	.show-phone-number {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.2rem;
		margin-top: 10px;
		letter-spacing: 10px; /* Ajusta el valor según el espacio deseado */
	}

	.sending-button {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.phone-sending {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.cash-container .seccion-cash {
		/* margin-top: 0px; */
	}
</style>
