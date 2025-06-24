<script>
	import { goto } from '@roxi/routify'
	import { payment } from '@/stores/paymentsStore'
	import { getStorage, keepInStore } from '@/tools/functions'
	import { Pulse } from 'svelte-loading-spinners'
	import { texts } from '@/tools/variables'
	import AlertMessage from '@/components/AlertMessage.svelte'

	export let voucherCode
	let notValid = false

	console.log({ voucherCode })
	let validando = false
	let mensaje = 'APLICANDO LA PROMOCIÓN'
	let botonColor = 'button-orange'

	const checkoutId = getStorage('checkoutList')

	const codeApplied = () => {
		setTimeout(() => {
			$goto('/checkout')
		}, 500)
	}

	const isNotValid = () => {
		validando = true
		setTimeout(() => {
			validando = false
		}, 3000)
	}

	const checkoutAddVoucher = async () => {
		validando = true

		const response = await payment.checkoutAddVoucher(checkoutId, voucherCode)

		keepInStore('voucher-applied', 'no')
		console.log({ response })
		if (response.status == 200) {
			if (response.body.message == 'Discount applied.') {
				mensaje = 'PROMOCION APLICADA'
				keepInStore('voucher-applied', 'yes')
				codeApplied()
			} else {
				mensaje = 'EL CUPÓN NO VÁLIDO PARA SU COMPRA'
				botonColor = 'button-orange'
				notValid = true
			}
		} else {
			mensaje = 'Cupón no aplicable a su compra'
			botonColor = 'button-red'
			notValid = true
		}
		validando = false
	}
	checkoutAddVoucher()

	const closeButtonAlert = () => {
		$goto('/checkout')
	}
</script>

<div class="voucher-container">
	<div class="seccion-voucher">Cupón de descuento</div>
	<div class="result-voucher">
		<button class="button {botonColor}">{mensaje}</button>
	</div>

	{#if validando}
		<div class="validando">
			<Pulse size="120" unit="px" duration="2s" />
		</div>
	{/if}
	{#if notValid}
		<AlertMessage text="CUPON NO VÁLIDO" secondaryText={texts.voucherInvalid} {closeButtonAlert} />
	{/if}
</div>
