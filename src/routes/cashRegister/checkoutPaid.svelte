<script>
	import { goto } from '@roxi/routify'
	import { getRole, extractDigits, getStorage, keepInStore, cleanStore } from '@/tools/functions'
	import { product, checkoutList } from '@/stores/productStore'

	const userRole = getRole()
	const phoneNumber = getStorage('phoneNumber')
	const customerId = getStorage('customerId')

	const createCheckout = async () => {
		// const phoneDigits = extractDigits(phoneNumber)
		// console.log({ phoneDigits })
		// const customerEmail = String(phoneDigits) + '@nxlabs.io'
		const customerEmail = phoneNumber + '@nxlabs.io'
		// console.log({ customerEmail })
		cleanStore('checkoutList')
		cleanStore('attenpo-order-id')
		cleanStore('order-payment')
		cleanStore('payment-type')
		cleanStore('product-found')
		cleanStore('attenpo-order-number')
		cleanStore('hidden-mode')
		cleanStore('receipPhoneNumber')
		cleanStore('total-payment')
		cleanStore('order-confirmed')

		try {
			const response = await product.createCheckout(customerEmail)
			$checkoutList = response.checkoutCreate.checkout.id
			keepInStore('checkoutList', $checkoutList)
			const attaching = await product.checkoutCustomerAttach($checkoutList, customerId)
			console.log('Attach:', attaching)
			$goto('/products')
		} catch (error) {
			console.error('Error fetching createCheckout:', error)
		}
	}
</script>

<div class="section-name">Pago exitoso</div>

<div class="cash-payment-container">
	<div class="cash-payment-button-success">
		{#if userRole == 'client'}
			<!-- <button class="button button-green" on:click={() => $goto('/cashRegister')}>NUEVA OPERACIÓN</button> -->
			<button class="button button-red">ACCESO RESTRINGIDO</button>
		{:else}
			<button class="button button-green" on:click={createCheckout}>USUARIO SIGUIENTE</button>
			<button class="button button-black" on:click={() => $goto('/cashRegister')}>SALIR</button>
		{/if}
	</div>
</div>
