<script>
	import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
	import { product, totalCheckoutValues } from '@/stores/productStore'
	import { getRole, getStorage } from '@/tools/functions'
	import Fa from 'svelte-fa'
	import { Jumper } from 'svelte-loading-spinners'
	import { faMoneyBill1 } from '@fortawesome/free-regular-svg-icons'
	import CheckoutTotals from './product/CheckoutTotals.svelte'

	export let handleCardPayment
	export let handleCashPayment
	export let destiny

	const role = getRole()

	const checkoutList = getStorage('checkoutList')
	// const voucherApplied = getStorage('voucher-applied')
	// console.log({ voucherApplied })

	// let totalCheckout = 0
	// let discount = 0
	// let totalPayment = 0

	/* 
	const getCheckoutComplete = async () => {
		// console.log('CALCULANDO')
		// const response = await product.loadCheckoutComplete(checkoutList)
		// console.log('getCheckoutComplete', { response })
		// discount = response.checkout.discount.amount
		// totalPayment = response.checkout.totalPrice.gross.amount
		// totalCheckout = totalPayment + discount
		// $totalCheckoutValues = {
		// 	discount,
		// 	totalCheckout,
		// 	totalPayment,
		// }
	}
	getCheckoutComplete()
	 */
</script>

<div class="checkout-container">
	<div class="section-checkout">Método de pago</div>
	<div class="checkout-methods">
		<button class="square-method" on:click={() => handleCardPayment()} class:selected={destiny == 'card'}>
			<span>
				<Fa icon={faCreditCard} size="3x" />
			</span>
			<span>Pago con Tarjeta<br /><small>Crédito/Débito</small></span>
		</button>
		<button class="square-method" on:click={() => handleCashPayment()} class:selected={destiny == 'cash'}>
			<span>
				<Fa icon={faMoneyBill1} size="3x" />
			</span>
			<span>Pago con<br /><small>Efectivo</small></span>
		</button>
	</div>
	<div class="checkout-message">
		{#if role == 'admin'}
			Luego de seleccionar el método de pago, verás un QR para que el usuario lo escanee y desde WhatsApp confirme la
			compra
		{:else}
			Luego de seleccionar el método de pago, deberás acercarte a alguna de las terminales para finalizar tu compra
		{/if}
	</div>
	<CheckoutTotals />
	<slot />
</div>
