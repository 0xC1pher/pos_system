<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import ScannerViewerO from '@/components/ScannerViewerO.svelte'
	import { product, productLoaded, checkoutTotal } from '@/stores/productStore'
	import { keepInStore, keepInStoreJson, getRole, getStorage, cleanStore } from '@/tools/functions'

	import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import NotFound from '@/components/product/NotFound.svelte'

	onMount(() => {
		cleanStore('product-found')
	})

	const role = getRole()
	let userCashRegister = getStorage('userCashRegister')
	userCashRegister = userCashRegister ? userCashRegister.toLowerCase() : ''

	let qrResult = ''
	let productData
	let found = false
	let loading = false
	let loadedAdvice = false
	let message = false
	let searchButtonDisabled = true

	const bringProduct = async (qrText) => {
		try {
			if (qrText != '') {
				console.log({ qrText })
				loading = true
				productData = await product.productVariantSku(qrText)
				console.log('productData', { productData })
				found = productData.productVariant !== null
				loading = false
				if (found) {
					console.log('product-found', productData.productVariant, { qrText })
					keepInStoreJson('product-found', productData.productVariant)
					$goto('/products/show')
				} else {
					// stopCamera()
					// productNotFound()
					message = true
				}
			}
		} catch (error) {
			console.error('Error fetching product data:', error)
		}
	}
	$: bringProduct(qrResult)

	if ($productLoaded) {
		loadedAdvice = true
		setTimeout(() => {
			loadedAdvice = false
			$productLoaded = false
		}, 2000)
	}

	const closeButtonNotFound = () => {
		message = false
		$goto('/products/notFound')
	}

	const productNotFound = () => {
		message = true
		setTimeout(() => {}, 4000)
	}

	const agregarRecarga = () => {
		$goto('/recharge')
	}

	let qrManual = ''

	let instructions = 'Escanea el código del producto'
	let adquiring = 'Adquiriendo datos...'

	$: if (qrManual != '') {
		searchButtonDisabled = false
	}
</script>

<div class="scanner-container">
	<div class="scanner-title">Lector de códigos</div>
	<ScannerViewerO bind:qrResult />
	<div class="scanner-instruction">
		{#if loadedAdvice}
			Producto agregado al carrito
		{:else if message}
			<NotFound {closeButtonNotFound} />
		{:else}
			{loading ? adquiring : instructions}
		{/if}
	</div>
	{#if role == 'admin'}
		<div class="qr-manual">
			<input type="text" bind:value={qrManual} />
			<div class="glass">
				<Fa icon={faMagnifyingGlass} size="1.1x" />
			</div>
		</div>
		<button
			class="button button-green search"
			on:click={() => {
				qrResult = qrManual
			}}
			disabled={searchButtonDisabled}
			class:disabled={searchButtonDisabled}>Buscar código</button
		>
	{/if}
	{#if userCashRegister == 'attenpo_julian'}
		<button class="button button-orange search" on:click={agregarRecarga}>Agregar recarga</button>
	{/if}

	{#if $checkoutTotal > 0}
		<button class="button button-green search" on:click={() => $goto('/checkout')}>PAGAR</button>
	{/if}
</div>
