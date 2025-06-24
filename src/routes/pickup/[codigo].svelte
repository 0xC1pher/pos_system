<script>
	import { product } from '@/stores/productStore'
	import { SyncLoader } from 'svelte-loading-spinners'
	import { getRole } from '@/tools/functions'
	import { currency } from '@/tools/variables'
	import { payment } from '@/stores/paymentsStore'
	import { goto } from '@roxi/routify'
	import ProductItemsView from '@/components/product/ProductItemsView.svelte'
	export let codigo
	console.log(codigo)
	const orderId = codigo
	const userRole = getRole()

	const order = {
		lines: [],
		prodsQty: 0,
		paymentStatus: '',
		total: 0,
		currency: '',
		orderStatus: '',
		user: {},
	}

	let orderData
	const getOrder = async () => {
		const response = await product.getOrderComplete(orderId)
		orderData = await response.order
		order.lines = orderData.lines
		order.isPaid = orderData.isPaid
		order.paymentStatus = orderData.paymentStatus
		order.orderStatus = orderData.status
		order.total = orderData.total.gross.amount
		order.currency = orderData.total.gross.currency
		const initialValue = 0
		const quantity = order.lines.reduce(
			(accumulator, currentValue) => accumulator + currentValue.quantity,
			initialValue,
		)
		order.prodsQty = quantity
		console.log({ response })
		console.log({ order })
	}
	getOrder()

	const setPickUp = async () => {
		console.log('ORDEN RETIRADA')
		console.log({ orderId }, order.lines)

		try {
			const response = await product.setOrderFullFilled(orderId, order.lines)
			console.log('setPickUp', response)
			order.orderStatus = response.orderFulfill.errors.length == 0 ? 'FULFILLED' : 'ERROR'
			$goto('/cashRegister')
		} catch (error) {
			console.log('setPickUp', { error })
		}

		// Si 200 entonces cambiar status a FULFILLED para que se muestre el aviso de ORDEN RETIRADA
	}
</script>

<div class="section-name">Detalle de Orden</div>

{#if order.prodsQty == 0}
	<SyncLoader size="50" color="#d26c2b" unit="px" duration="1s" />
{:else}
	<div class="cash-payment-container">
		<ProductItemsView linesDetail={order.lines} />
		<div class="cash-payment-data">
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Total {order.isPaid ? 'abonado' : 'a pagar'}</div>
				<div class="cash-payment-right">
					{order.currency}
					{order.total}
				</div>
			</div>
			<div class="cash-payment-doble">
				<div class="cash-payment-left">Cantidad de productos</div>
				<div class="cash-payment-right">
					{order.prodsQty}
				</div>
			</div>
		</div>
	</div>

	{#if !order.isPaid}
		<button class="button button-red" on:click={() => $goto('/cashRegister')}>ORDEN NO PAGADA</button>
	{:else if order.orderStatus == 'FULFILLED'}
		<button class="button button-orange" on:click={() => $goto('/cashRegister')}>ORDEN RETIRADA</button>
	{:else}
		<button class="button button-green" on:click={setPickUp}>APROBAR RETIRO</button>
	{/if}
{/if}
