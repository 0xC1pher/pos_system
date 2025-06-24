<script>
	import { goto } from '@roxi/routify'
	import ScannerViewer from '@/components/ScannerViewer.svelte'
	import { getStorage, keepInStore } from '@/tools/functions'
	import { customerEmail, product, checkoutListId } from '@/stores/productStore'
	import Fa from 'svelte-fa'
	import { faRepeat } from '@fortawesome/free-solid-svg-icons'

	let qrResult = ''

	const images = ['greenFolder', 'orangeFolder', 'stoneCyan']

	const imageIndex = Math.floor(Math.random() * images.length)
	console.log({ imageIndex })

	// $: qrResult != '' && $goto('/cashRegister/cashPayment', { order: qrResult })

	const checkTypeQRScanned = (qrScanned) => {
		const [type, codigo] = qrScanned.split('-')
		console.log({ type, codigo })

		switch (type) {
			case 'checkout':
				$checkoutListId = codigo
				keepInStore('checkoutList', codigo)
				$goto('/products/list')
				break
			case 'order':
				const orderLink = `/pickup/${codigo}`
				console.log({ orderLink })
				$goto(orderLink, { codigo })
				break
			default:
				$goto('/cashRegister/notRecognized')
				break
		}
	}
	$: qrResult != '' && checkTypeQRScanned(qrResult)

	const phoneNumber = getStorage('phoneNumber')
	let ingresando = 'Registrar compra'
	let creando = false

	const createCheckout = async () => {
		$customerEmail = phoneNumber + '@nxlabs.io'
		console.log({ $customerEmail })
		ingresando = 'Ingresando...'
		creando = true
		try {
			const response = await product.createCheckout($customerEmail)
			$checkoutListId = response.checkoutCreate.checkout.id

			keepInStore('checkoutList', $checkoutListId)
			$goto('/products')
		} catch (error) {
			console.error('Error fetching createCheckout:', error)
		}
	}
</script>

<div class="scanner-container">
	<div class="scanner-title">Escanea el QR del usuario</div>
	<ScannerViewer bind:qrResult />
	<div class="buttons-accion">
		<button class="button button-green" on:click={createCheckout} disabled={creando}>{ingresando}</button>
		<button class="orange" on:click={() => $goto('/cashRegister/reload')}>
			<Fa icon={faRepeat} />
		</button>
	</div>
	<div class="scanner-fold">
		<img src="/images/{images[imageIndex]}.svg" alt="" class="resposive-svg" />
	</div>
</div>

<style>
</style>
