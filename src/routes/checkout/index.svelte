<script>
	// import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import { totalCheckoutValues, product, checkoutTotal } from '@/stores/productStore'
	// import { payment } from '@/stores/paymentsStore'
	import { getRole, getStorage, keepInStore, cleanStore } from '@/tools/functions'
	// import { Jumper } from 'svelte-loading-spinners'
	// import { vars } from '@/tools/variables'
	// import Fa from 'svelte-fa'
	// import { faCreditCard, faDollarSign } from '@fortawesome/free-solid-svg-icons'
	// import User from '../cashRegister/user/[user].svelte'
	import Checkout from '@/components/Checkout.svelte'
	import { faReacteurope } from '@fortawesome/free-brands-svg-icons'
	// import { faIdBadge } from '@fortawesome/free-regular-svg-icons'
	import { backLink, NoBackButton } from '@/stores/generalStore'
	import { hiddenMaxAmount } from '@/tools/variables'

	const orderPayment = getStorage('order-payment') || '' // confirmed
	let orderId = getStorage('attenpo-order-id') || ''
	$NoBackButton = true

	// if order is confirmed or orderId is not null, don't go back to products list
	$backLink = orderPayment == 'confirmed' || orderId != '' ? '.' : '/products/list'

	let destiny

	let totalCheckout = 0
	let discount = 0
	let totalPayment = 0
	let productscount = 0
	let hiddenMode = false

	const checkoutList = getStorage('checkoutList')
	const voucherApplied = getStorage('voucherApplied')

	// Check if the role is admin (starType = true)

	const role = getRole()

	let lines = []
	let productQty = 0
	const productsCounter = () => {
		productQty = lines.reduce((acumulador, prod) => acumulador + prod.quantity, 0)
		console.log('productsCounter', { productQty })
	}

	const getCheckout = async () => {
		let response
		if (orderId) {
			response = await product.getOrderComplete(orderId)
			console.log('getOrderComplete', { response })
			discount = response.order.discounts[0] ? response.checkout.discounts[0].amount : 0
			totalPayment = response.order.total.gross.amount
			productscount = response.order.lines.length
			lines = response.order.lines
			// keepInStore('total-payment', totalPayment)
		} else {
			response = await product.loadCheckoutComplete(checkoutList)
			console.log('getCheckoutComplete', { response })
			discount = response.checkout.discount ? response.checkout.discount.amount : 0
			totalPayment = response.checkout.totalPrice.gross.amount
			productscount = response.checkout.lines.length
			lines = response.checkout.lines
		}
		productsCounter()
		totalCheckout = totalPayment + discount
		keepInStore('total-payment', totalCheckout)
		/**
		 * if total payment is less than 30 or if there is only one product
		 */
		productsCounter()
		hiddenMode = totalPayment < hiddenMaxAmount || productQty == 1
		// hiddenMode = totalPayment < 30 || (productQty == 1 && totalPayment > 30)
		keepInStore('hidden-mode', hiddenMode)
		console.log('hidden-mode', { hiddenMode })

		$totalCheckoutValues = {
			discount,
			totalCheckout,
			totalPayment,
		}
	}
	getCheckout()
	if (voucherApplied == 'yes') {
	}

	const handleCashPayment = async () => {
		keepInStore('payment-type', 'cash')
		destiny = 'cash'
		if (role == 'admin') {
			// $goto('/checkout/phone-number')
			// cleanStore('attenpo-order-id')
			// cleanStore('order-payment')
			if ((orderPayment && orderPayment == 'confirmed') || hiddenMode) {
				$goto('/cashRegister/cashPayment')
				return
			}
			$goto('/cashRegister/order-confirm')
		} else {
			$goto('/checkout/cash')
		}
	}

	const handleCardPayment = () => {
		keepInStore('payment-type', 'card')
		destiny = 'card'
		// Go to read de Terminal Serial QR
		if (role == 'admin') {
			// $goto('/checkout/phone-number')
			if (orderPayment && orderPayment == 'confirmed') {
				$goto('/checkout/card/terminalSelector')
				return
			}
			$goto('/cashRegister/order-confirm')
			// $goto('/checkout/card/terminalSelector')
		} else {
			$goto('/checkout/card/terminalSelector')
		}
	}

	let cancelMessage = 'CANCELAR ORDEN'
	const cancelOrder = async () => {
		cancelMessage = 'CANCELANDO'
		if (orderId) {
			try {
				const response = await product.cancelOrder(orderId)
				console.log('cancelOrder', { response })
			} catch (error) {
				console.error('cancelOrder', { error })
			}
		}
		setTimeout(() => {
			cancelMessage = 'ORDEN CANCELADA'
		}, 1000)
		$goto('/cashRegister')
	}
</script>

<Checkout {handleCardPayment} {handleCashPayment} {destiny}>
	<div class="voucher-button">
		<button class="load-voucher" on:click={() => $goto('/checkout/voucher')}>
			<img src="/images/voucher.png" alt="cupon" />
			¿TIENES UN CUPÓN?</button
		>
		<button class="button button-green" on:click={cancelOrder}>
			{cancelMessage}
		</button>
	</div>
</Checkout>
