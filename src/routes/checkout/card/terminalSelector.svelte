<script>
	/**
	 * for reading the QR of CLI PointSmart
	 */
	import { onDestroy } from 'svelte'
	import { goto } from '@roxi/routify'
	import { Jumper } from 'svelte-loading-spinners'
	import Fa from 'svelte-fa'
	import { terminals } from '@/stores/terminalStore'
	import { product, checkoutListId, totalCheckoutValues } from '@/stores/productStore'
	import { payment } from '@/stores/paymentsStore'
	// import { vars, serialPOSClip } from '@/tools/variables'
	import { keepInStore, getRole, getStorage } from '@/tools/functions'
	import { faDiceOne } from '@fortawesome/free-solid-svg-icons'
	import { faDigitalOcean } from '@fortawesome/free-brands-svg-icons'
	import { backLink } from '@/stores/generalStore'

	$backLink = '/checkout'

	let processing = false
	let serialVerification = false
	let showButtons = true
	let terminalList = []
	let interval
	let serialPOSClip = []

	const orderId = getStorage('attenpo-order-id') || ''
	console.log('orderId', orderId)

	onDestroy(() => {
		clearInterval(interval)
	})

	const userRole = getRole()
	const mode = userRole == 'client' ? 'self-checkout' : getStorage('service')

	// adapt to user role
	const role = userRole == 'admin' ? 'cashier' : 'user'

	const getTerminals = async () => {
		try {
			const response = await terminals.getTerminals()
			console.log('terminals', { response })
			terminalList = response.body
			console.log({ terminalList })
			serialPOSClip = terminalList.map((terminal) => terminal.serial)
			console.log({ serialPOSClip })
		} catch (error) {
			console.error('getTerminals', { error })
		}
	}
	getTerminals()

	const handleCardPayment = async (serial) => {
		console.log({ serial }, serialPOSClip.includes(serial))

		if (serialPOSClip.includes(serial)) {
			showButtons = false
			processing = true
			console.log('terminal encontrada', serial)
			const totalPayment = $totalCheckoutValues.totalPayment
			try {
				const response1 = await product.updateBillingAddress($checkoutListId)
				// const response2 = await product.orderCreateFromCheckout($checkoutListId)
				// console.log('orderCreateFromCheckout', { response2 })
				console.log('mode', mode)
				if (mode === 'self-checkout') {
					const responseSelf = await payment.sendPaymentIntentCard($checkoutListId, totalPayment, serial)
					console.log('responseSelf', responseSelf)
				} else {
					const responseAssited = await payment.sendPaymentIntentCard(orderId, totalPayment, serial)
					console.log('responseAssited', responseAssited)
				}
				keepInStore('attenpo-order-total', totalPayment)
				processing = false
				$goto('/checkout/card')
			} catch (error) {
				console.log('handleCardPayment', { error })
			}
		} else {
			serialQrVerifiedError()
		}
	}

	const serialQrVerifiedError = () => {
		serialVerification = true
		interval = setTimeout(() => {
			serialVerification = false
			$goto('/checkout/notFound')
		}, 1000)
	}
</script>

<div class="scanner-container">
	<div class="scanner-title">Terminal de pago</div>
	{#if processing}
		<div class="waiting">
			<Jumper size="100" color="#d26c2b" unit="px" duration="1s" />
		</div>
	{/if}
	{#if showButtons}
		<div class="terminal-buttons">
			{#each terminalList as terminal, key}
				{#if terminal.active && (terminal.mode == role || terminal.mode == 'both')}
					<!-- content here -->
					<button
						class="terminal"
						on:click={() => handleCardPayment(terminal.serial)}
						title={`# Serial terminal: ${terminal.serial}`}>{terminal.name}</button
					>
				{/if}
			{/each}
		</div>
	{/if}
	<div class="terminal-instructions">
		Selecciona la terminal de pago<br />que vas a utilizar
	</div>
	{#if serialVerification}
		<div class="error-message">
			<button class="button button-red"> QR INVÁLIDO </button>
		</div>
	{/if}
</div>
