<script>
	import { onMount } from 'svelte'
	import { getStorage, getRole, keepInStore, cleanStore } from '@/tools/functions'
	import { goto } from '@roxi/routify'
	import { customerEmail, product, checkoutList } from '@/stores/productStore'
	import Fa from 'svelte-fa'
	import { faCartShopping, faSpinner, faMoneyBill } from '@fortawesome/free-solid-svg-icons'
	import { faCreditCard } from '@fortawesome/free-regular-svg-icons'

	/**
	 * TODO: if attenpo-order-id exist, cancel order
	 */

	const orderId = getStorage('attenpo-order-id')
	const orderConfirmed = getStorage('order-confirmed')

	const cancelOrder = async () => {
		// try {
		// const responseCancel = await product.cancelOrder(orderId)
		// console.log('cancelOrder', { responseCancel })
		// } catch (error) {
		// console.error('cancelOrder', { error })
		// }
	}
	if (orderId) {
		cancelOrder()
	}

	onMount(() => {
		cleanStore('service')
		cleanStore('checkoutList')
		cleanStore('attenpo-order-id')
		cleanStore('order-payment')
		cleanStore('payment-type')
		cleanStore('product-found')
		cleanStore('attenpo-order-number')
		cleanStore('hidden-mode')
		cleanStore('receipPhoneNumber')
		cleanStore('total-payment')
		cleanStore('attenpo-order-total')
		cleanStore('order-confirmed')
		cleanStore('edit-checkout')
	})
	const userRole = getRole()
	if (userRole == 'client') {
		$goto('/')
	}

	let creando = false
	let editando = false
	// const clientName = getStorage('clientName')
	const userCashRegister = getStorage('userCashRegister').toLowerCase()
	const customerId = getStorage('customerId')

	console.log('cashRegister/index', { customerId })

	let ingresando = 'REGISTRO DE COMPRA'

	const userAtention = () => {
		if (userRole != 'admin') {
			$goto('/')
		} else {
			keepInStore('service', 'self-checkout')
			keepInStore('edit-checkout', '0')
			$goto('/cashRegister/scanterminal')
		}
	}

	const editCheckout = () => {
		if (userRole != 'admin') {
			$goto('/')
		} else {
			keepInStore('service', 'editing-checkout')
			keepInStore('edit-checkout', '1')
			$goto('/cashRegister/scanterminal')
		}
	}

	const ingresarInventario = () => {
		$goto('/inventory')
	}

	const setTerminals = () => {
		$goto('/cashRegister/terminals')
	}

	const setCashiers = () => {
		$goto('/cashRegister/cashiers')
	}

	const createCheckout = async () => {
		console.log('createCheckout', { customerId })
		creando = true
		keepInStore('service', 'assisted-checkout')
		try {
			const newCheckout = await product.createCheckout($customerEmail)
			$checkoutList = newCheckout.checkoutCreate.checkout.id
			// check if necessary
			// $checkoutList = $checkoutList
			keepInStore('checkoutList', $checkoutList)
			const attaching = await product.checkoutCustomerAttach($checkoutList, customerId)
			console.log('Attach:', attaching)
			creando = false
			$goto('/products')
		} catch (error) {
			console.error(error)
			creando = false
			console.log('Error al crear carrito de compras')
		}
	}
</script>

<div class="admin-container">
	<div class="admin-logo">
		<!-- <img src="/images/attenpo-shop.svg" alt="" class="Attenpo" /> -->
	</div>
	<div class="admin-title">ZONA<br />RESTRINGIDA</div>
	<div class="nav-buttons">
		<button class="button button-green" on:click={userAtention}>ATENCIÓN AL USUARIO</button>
		<button class="button button-red with-spinner" on:click={editCheckout}>
			EDITAR COMPRA
			<span>
				{#if editando}
					<Fa icon={faSpinner} size="1.3x" spin />
				{:else}
					<Fa icon={faCartShopping} size="1.3x" />
				{/if}
			</span>
		</button>

		<button class="button button-blue with-spinner" on:click={createCheckout} disabled={creando}>
			<span>
				{ingresando}
			</span>
			<span>
				{#if creando}
					<Fa icon={faSpinner} size="1.3x" spin />
				{:else}
					<Fa icon={faCartShopping} size="1.3x" />
				{/if}
			</span>
		</button>

		<button class="button button-orange" on:click={ingresarInventario}>CONTROL DE INVENTARIO</button>

		<button class="button button-white with-spinner" on:click={setTerminals}
			>TERMINALES DE PAGO
			<Fa icon={faCreditCard} size="1.3x" />
		</button>

		{#if userCashRegister == 'attenpo_julian' || userCashRegister == 'attenpo_edwin'}
			<button class="button button-gray with-spinner" on:click={setCashiers}
				>CASHIERS
				<Fa icon={faMoneyBill} size="1.3x" color="white" />
			</button>
		{/if}

		<button class="button button-black" on:click={() => $goto('/')}>SALIR</button>
	</div>
</div>
