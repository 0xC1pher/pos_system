<script>
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '@roxi/routify'
	import ScannerViewer from '@/components/ScannerViewer.svelte'
	import { getStorage, keepInStore, editMode } from '@/tools/functions'
	import { customerEmail, product, checkoutListId } from '@/stores/productStore'
	import Fa from 'svelte-fa'
	import { faRepeat } from '@fortawesome/free-solid-svg-icons'

	let qrResult = ''

	// if edit checkout is active, the user can edit the checkout
	let editing = editMode()
	let title = 'Atención al Usuario'
	if (editing) {
		title = 'Editar compra'
	}

	onDestroy(() => {
		clearTimeout(timeout)
	})

	const getCheckout = async (checkout) => {
		console.log('checking checkout', { checkout })
		const response = await product.loadCheckout(checkout)
		console.log('fetchCheckout', { response })
		if (response.checkout === null) {
			$goto('/cashRegister/notRecognized')
		} else {
			keepInStore('checkoutList', checkout)
			$goto('/products/list')
		}
	}

	const checkTypeQRScanned = (qrScanned) => {
		const [type, codigo] = qrScanned.split('-')
		console.log({ type, codigo })

		switch (type) {
			case 'checkout':
				$checkoutListId = codigo
				if (editing) {
					getCheckout(codigo)
				} else {
					$goto('/cashRegister/cashPayment')
				}
				break
			case 'order':
				if (editing) {
					$goto('/cashRegister/notRecognized')
				} else {
					const orderLink = `/pickup/${codigo}`
					console.log({ orderLink })
					$goto(orderLink, { codigo })
				}
				break
			default:
				$goto('/cashRegister/notRecognized')
				break
		}
	}
	$: qrResult != '' && checkTypeQRScanned(qrResult)

	// If the user does not scan the QR, the app will automatically redirect to the home page after 49 seconds
	let timeout = setTimeout(() => {
		$goto('/cashRegister')
	}, 49000)
</script>

<div class="scanner-container">
	<div class="scanner-title">{title}</div>
	<ScannerViewer bind:qrResult />
	<div class="buttons-accion">
		<button
			class="button button-green"
			on:click={() => {
				$goto('/cashRegister')
			}}>VOLVER AL INICIO</button
		>
		<button class="orange" on:click={() => $goto('/cashRegister/reload')}>
			<Fa icon={faRepeat} />
		</button>
	</div>
</div>
