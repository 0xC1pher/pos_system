<script>
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '@roxi/routify'
	import Fa from 'svelte-fa'
	import QrCode from '@/components/QrCode.svelte'
	import { currency, vars } from '@/tools/variables'
	import { getStorage, keepInStore } from '@/tools/functions'
	import { product } from '@/stores/productStore'
	import { printCurrentDateTime } from '@/tools/functions'
	import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'

	const dateTime = printCurrentDateTime()

	let interval
	let checkoutTotal = 0,
		checkoutLines = [],
		checkoutList = ''

	// onMount(() => {})
	checkoutList = getStorage('checkoutList')

	onDestroy(() => {
		clearInterval(interval)
	})

	let errorMessage = ''
	let orderId = getStorage('attenpo-order-id')

	/**
	 * Wait for agent approval
	 */

	const checkOrder = async () => {
		// if (orderId) {
		try {
			const response = await product.getOrder(orderId)
			// console.log('checkOrder', response.order.paymentStatus)
			console.log('checkOrder', response)
			// const isPaid = response.order.isPaid
			const status = response.order.status
			console.log('status', { status })
			if (status != 'UNFULFILLED') {
				clearInterval(interval)
				$goto('/order-paid/thanks')
			}
		} catch (error) {
			console.log('checkOrder', error)
			throw error
		}
		// }
		/* 		 else {
			console.log('orderId no existe')
			$goto('/')
		} */
	}

	// setInterval
	interval = setInterval(() => {
		checkOrder()
		console.log('chequeando')
	}, vars.checkingDelay)
</script>

<div class="control-container">
	<div class="seccion-control">
		Último detalle
		<Fa icon={faArrowAltCircleRight} size="1.1x" />
	</div>
	<QrCode textToQR={`order-${orderId}`} />
	<div class="instruct-control">
		Acércate a un<br />Anfitrión para que<br />valide tu salida
	</div>
</div>
