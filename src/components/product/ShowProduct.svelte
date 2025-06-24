<script>
	import Quantity from '../Quantity.svelte'
	import { goto } from '@roxi/routify'
	import Fa from 'svelte-fa'
	import { faTimes, faCheck, faCancel, faArrowRotateLeft, faWarning } from '@fortawesome/free-solid-svg-icons'
	import { extractDecimal, formatNumber2DecDot } from '@/tools/functions'
	import { currency } from '@/tools/variables'
	import { productFound, productLoaded } from '@/stores/productStore'
	import QuantityButtons from '../QuantityButtons.svelte'

	// console.log('MOSTRAR: ', $productFound);
	// console.log('Imagen: ', $productFound.productVariant.media[0].url);
	// const variantId = $productFound.productVariant.id

	export let prod, quantity
	export let checkoutLinesAdd

	$: price = extractDecimal(prod.price * quantity)

	const stockQty = prod.quantity
	// console.log({ stockQty })

	const returnToScannerViewer = () => {
		$productLoaded = false
		$goto('/products')
	}

	export let addingErrorMessage, errorMessage, errorCode

	// $: console.log({ stockQty, quantity }, stockQty < quantity)
	let noStock = false
</script>

<!-- <ReturnMarquee /> -->
<div class="product-container">
	<div class="product-imagen">
		{#if prod.image !== ''}
			<img src={prod.image} alt={prod.name} />
		{/if}
		<div class="image-before">
			<!-- <Fa icon={faAngleLeft} size="2x" /> -->
		</div>

		<div class="image-next">
			<!-- <Fa icon={faAngleRight} size="2x" /> -->
		</div>
	</div>
	<!-- {prod.description || ''} -->

	<div class="product-name">{prod.name}</div>

	<div class="product-price">
		<div class="price-currecy">
			{currency}
		</div>
		<div class="price-amount">
			{formatNumber2DecDot(price)}
		</div>
	</div>

	<div class="quantity-container">
		<div class="how-many">¿Cuántos llevas?</div>
		<Quantity bind:quantity {stockQty} />
		<div>Selecciona una cantidad</div>
		<QuantityButtons bind:quantity {stockQty} />
	</div>
	<div class="product-buttons">
		<button class="button-return" on:click={returnToScannerViewer}>
			<Fa icon={faTimes} size="3x" color="white" />
		</button>
		<button
			class="button-action"
			on:click={checkoutLinesAdd}
			disabled={stockQty < quantity}
			class:disabled={stockQty < quantity}
		>
			<Fa icon={faCheck} size="3x" color="white" />
		</button>
	</div>

	<!-- product stock qty == 0 -->
	{#if stockQty == 0}
		<div class="product-no-stock-container">
			<button class="product-no-stock" on:click={returnToScannerViewer}>
				<Fa icon={faCancel} size="6x" />
				<span>SIN STOCK</span>
			</button>
		</div>
	{/if}

	<!-- product adding error -->
	{#if addingErrorMessage}
		<div class="product-stock-error">
			<Fa icon={faWarning} size="3x" color="red" />
			<div>
				<span>Error al cargar el producto, contáctese con el encargado.</span>
				<span class="error-code">{errorCode}: {errorMessage}</span><br />
				<span class="sorry">Sepa disculpar las molestias</span>
			</div>
		</div>
	{/if}
</div>
