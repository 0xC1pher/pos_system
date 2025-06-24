<script>
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '@roxi/routify'
	import QrCode from '@/components/QrCode.svelte'
	import { currency, vars } from '@/tools/variables'
	import { getStorage, keepInStore, printCurrentDateTime, getRole } from '@/tools/functions'
	import { product, totalCheckoutValues } from '@/stores/productStore'
	import CheckoutTotals from '@/components/product/CheckoutTotals.svelte'

	const dateTime = printCurrentDateTime()
	const userRole = getRole()

	let interval
	let checkoutTotal = 0,
		checkoutLines = [],
		status = '',
		checkoutList = ''

	// onMount(() => {})
	checkoutList = getStorage('checkoutList')

	onDestroy(() => {
		clearInterval(interval)
	})

	let checkoutListData = []
	let productsCount = 0
	let calculating = false
	let errorMessage = ''
	let QRtext = ''
	let orderPaid = false
	const checkoutId = getStorage('checkoutList')

	const totals = (data) => {
		checkoutTotal = data.length != 0 ? data.checkout.totalPrice.gross.amount : 0
		productsCount = data.length != 0 ? data.checkout.lines.length : 0
		checkoutLines = data.length != 0 ? data.checkout.lines : []
	}

	const loadCheckout = async () => {
		calculating = true
		let checkoutExists = false
		try {
			if (checkoutList) {
				checkoutListData = await product.loadCheckoutComplete(checkoutList)
				checkoutExists = checkoutListData.checkout
				console.log(' checkoutListData ', checkoutExists)
			}
			if (checkoutExists) {
				totals(checkoutListData)
				console.log({ checkoutListData })
				QRtext = `checkout-${checkoutList}`
			} else {
				// if checkoutExists is null, jumpt to home page
				$goto('/checkout/cash/notFound')
			}
		} catch (error) {
			errorMessage = error.message
		} finally {
			// const salida = totals(checkoutListData);
			// console.log({ salida });
			// console.log({ productsCount })
			calculating = false
		}
	}
	loadCheckout()

	/**
	 * Check payment status of the checkoutId
	 */

	const checkOrderStatus = async () => {
		try {
			const response = await product.getOrderPaymentStatus(checkoutId)
			console.log('paymentStatus', response)
			const payStatus = response.order.paymentStatus
			if (payStatus == 'FULLY_CHARGED') {
				const orderId = response.order.id
				keepInStore('attenpo-order-id', orderId)
				clearInterval(interval)
				orderPaid = true

				// * si es admin regresa al escanneo de usuario
				// * si es usuario pregunta si quiere factura

				if (userRole == 'admin') {
					$goto('/cashRegister/checkoutPaid')
				} else {
					$goto('/order-paid')
				}
			}
		} catch (error) {}
	}

	interval = setInterval(() => {
		checkOrderStatus()
		console.log('chequeando')
	}, vars.checkingDelay)

	// setInterval
</script>

<div class="cash-container">
	<div class="seccion-cash">Pago con efectivo</div>
	<QrCode textToQR={QRtext} />
	<div class="instruct-cash">
		Acércate a un anfitrión<br />para que tome tu QR
	</div>
	<CheckoutTotals />
</div>
