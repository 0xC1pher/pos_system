<script>
	/**
	 * @change product quantity modal window
	 */
	import { goto } from '@roxi/routify'
	import { faCheck, faCheckSquare, faTimes } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import { Moon } from 'svelte-loading-spinners'
	import Quantity from '../Quantity.svelte'
	import { currency } from '@/tools/variables'
	import { checkoutTotal, checkoutListId, product, checkoutLines } from '@/stores/productStore'
	export let productView, productViewClose, productViewKey, productViewEnabled

	console.log('checkoutLines', $checkoutLines)

	console.log('Vista del producto', { productView })

	const name = productView.variant.name
	const image = productView.variant.media[0]?.url || ''
	const stockQty = productView.variant.quantityAvailable
	const quantityOrigin = productView.quantity
	let quantity = productView.quantity
	let updatingProductQty = false
	let updatingProcess = false

	$: confirmButtonDisabled = quantityOrigin == quantity

	// checkout total
	const actualCheckoutTotal = $checkoutTotal
	// product price * quantity
	let totalPrice = productView.totalPrice.net.amount
	// product price
	let productPrice = totalPrice / quantity
	console.log('producto productPrice', productPrice)

	$: newTotalPrice = productPrice * quantity

	// const calcCheckoutTotal = () => {
	//   return $checkoutLines.reduce((acumulador, prod) => acumulador + prod.totalPrice.net.amount, 0)
	// }
	// console.log('suma', calcCheckoutTotal())

	const productQtyChange = async (prod, qty) => {
		updatingProductQty = true
		updatingProcess = true
		const checkoutLine = prod.id
		const newCheckoutTotal = actualCheckoutTotal - totalPrice + newTotalPrice
		console.log('newCheckoutTotal = ', { actualCheckoutTotal, totalPrice, newTotalPrice, newCheckoutTotal })
		console.log('productQtyChange', { prod, qty, checkoutLine, newCheckoutTotal })
		console.log('datos', { $checkoutListId, checkoutLine, qty, productViewKey })

		// productViewKey

		try {
			const response = await product.updateCheckoutLine($checkoutListId, checkoutLine, qty)
			console.log('productQtyChange', { response })
			const lines = $checkoutLines
			lines[productViewKey].totalPrice.net.amount = newTotalPrice
			lines[productViewKey].quantity = qty
			$checkoutTotal = newCheckoutTotal
			// updatingProductQty = false
			console.log('checkoutLines final', lines)
			updatingProcess = false
			productViewEnabled = false
			$goto(`/products/reList`)
			checkoutLines.set(lines)
		} catch (error) {
			console.log('calcCheckoutTotal', { error })
		}

		// todo: cambiar la cantidad y el precio en el array $checkoutLines
		// ejecuter el query para modificar el checkoutLine
	}
</script>

<div class="product-list-view">
	<div class="view-marquee">
		<div class="view-product-name">{name}</div>
		<div class="view-product-close">
			<button on:click={productViewClose}>
				<Fa icon={faTimes} size="1.3x" />
			</button>
		</div>
	</div>
	{#if !updatingProductQty}
		<div class="view-product-details">
			<div class="view-product-image">
				<img src={image} alt={name} />
			</div>
			<div>
				<!-- TODO: consider stockQty as maximum -->
				<Quantity bind:quantity size={2} {stockQty} />
			</div>
			<div class="view-product-price">
				<div class="price-currency">
					{currency}
				</div>
				<div class="price-amount">
					{newTotalPrice}
				</div>
			</div>
			<div class="view-product-qty-confirm">
				<button
					class="button-qty-confirm"
					on:click={() => productQtyChange(productView, quantity)}
					disabled={confirmButtonDisabled}
					class:disabled={confirmButtonDisabled}
				>
					CONFIRMAR
				</button>
			</div>
		</div>
	{:else}
		<div class="view-product-qty-message">
			{#if updatingProcess}
				<div class="view-message">Actualizando...</div>
				<div class="icono">
					<Moon size="50" color="#d26c2b" unit="px" duration="1s" />
				</div>
			{:else}
				<div class="view-message">Actualizado</div>
				<div class="icono">
					<Fa icon={faCheckSquare} color="#014b3d" size="3x" />
				</div>
			{/if}
		</div>
	{/if}
</div>
