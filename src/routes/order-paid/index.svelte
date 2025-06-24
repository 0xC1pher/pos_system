<script>
	import { goto } from '@roxi/routify'
	import { product } from '@/stores/productStore'
	import { cleanLocalStorage, getRole, getStorage } from '@/tools/functions'

	cleanLocalStorage()

	const role = getRole()
	const paymentType = getStorage('payment-type')

	const sendInvoice = () => {
		console.log('FACTURA')
	}

	const shoppEnded = (opt) => {
		// console.log({ opt })
		// if (opt == 'yes') {
		// 	sendInvoice()
		// }
		paymentType && paymentType == 'card' ? $goto('/order-paid/control') : $goto('/order-paid/thanks')
	}

	/**
	 * TODO: por ahora saltea este paso y va directamente al "GRACIAS"
	 */
	shoppEnded()
</script>

<!-- 
<div class="confirm-container">
	<div class="section-name">Pago realizado con éxito</div>
	{#if role == 'admin'}
		<button class="button button-green" on:click={() => $goto('/cashRegister/scanterminal')}>USUARIO SIGUIENTE</button>
	{:else}
		<div class="confirm-help">¿Desea generar su factura?</div>
		<div class="confirm-options">
			<button
				class="square-confirm"
				on:click={() => {
					shoppEnded('Yes')
				}}
			>
				Si
			</button>
			<button
				class="square-confirm"
				on:click={() => {
					shoppEnded('No')
				}}
			>
				No
			</button>
		</div>
	{/if}
</div>
-->
