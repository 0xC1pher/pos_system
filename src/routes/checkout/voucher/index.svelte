<script>
	import { goto } from '@roxi/routify'
	import ScannerViewer from '@/components/ScannerViewer.svelte'
	// import { payment } from '@/stores/paymentsStore'
	// import { getStorage, keepInStore } from '@/tools/functions'
	// import { customerEmail, product, checkoutListId } from '@/stores/productStore'
	import Fa from 'svelte-fa'
	import { faRepeat } from '@fortawesome/free-solid-svg-icons'

	let qrResult = ''
	let voucherCode = ''

	// console.log('checkouId', $checkoutListId)

	// const images = ['greenFolder', 'orangeFolder', 'stoneCyan']

	// const imageIndex = Math.floor(Math.random() * images.length)
	// console.log({ imageIndex })

	// $: qrResult != '' && $goto('/cashRegister/cashPayment', { order: qrResult })

	let invalid = false

	const checkTypeQRScanned = (qrScanned) => {
		const [type, codigo] = qrScanned.split('_')
		console.log({ type, codigo })
		switch (type) {
			case 'voucher':
				voucherCode = codigo
				$goto('/checkout/voucher/:voucherCode', { voucherCode })
				break
			default:
				isNotValid()
				break
		}
	}
	$: qrResult != '' && checkTypeQRScanned(qrResult)

	const isNotValid = () => {
		invalid = true
		setTimeout(() => {
			invalid = false
			$goto('/checkout/voucher/reScanner')
		}, 1000)
	}
</script>

<div class="scanner-container">
	<div class="scanner-title">Cupón de descuento</div>
	<ScannerViewer bind:qrResult />
	<!-- <div class="scanner-fold">
		<img src="/images/{images[imageIndex]}.svg" alt="" class="resposive-svg" />
	</div> -->
	<div class="scanner-instruction">Escanea el QR del Cupón</div>
</div>

{#if invalid == true}
	<div class="button button-red">CUPÓN NO VÁLIDO</div>
{/if}
