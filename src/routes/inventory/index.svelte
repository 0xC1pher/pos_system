<script>
	import { goto } from '@roxi/routify'
	import { onDestroy } from 'svelte'
	import ScannerViewerO from '@/components/ScannerViewerO.svelte'
	import { checkoutList, product, productLoaded, checkoutTotal } from '@/stores/productStore'
	import { keepInStore, keepInStoreJson, getRole } from '@/tools/functions'

	import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import NotFound from '@/components/product/NotFound.svelte'

	const role = getRole()

	console.log('checkoutList', $checkoutList)

	// const interval = setTimeout(() => {
	// message = false
	// $goto('/products/notFound')
	// }, 60000)

	onDestroy(() => {
		// clearInterval(interval)
		// stopScanner()
	})

	let qrResult = ''
	let productData
	let found = false
	let loading = false
	let loadedAdvice = false
	let message = false

	const bringProduct = async (qrText) => {
		try {
			if (qrText != '') {
				console.log({ qrText })
				loading = true
				// productData = await product.productVariantSku(qrText)
				productData = await product.productVariantMini(qrText)
				console.log('productData', productData)
				found = productData.productVariant !== null
				loading = false
				if (found) {
					keepInStoreJson('product-found-inv', productData.productVariant)
					// console.log('product-found-inv', productData.productVariant)
					$goto('/inventory/show')
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
		$goto('/inventory/notFound')
	}

	const productNotFound = () => {
		message = true
		setTimeout(() => {}, 4000)
	}

	// let stopScanner = () => {}
	let qrManual = ''
</script>

<div class="scanner-container">
	<div class="scanner-title">Control de Inventario</div>
	<!-- <div class="scanner-add"> -->
	<!-- Los productos se agregarán a tu carrito<br />automáticamente -->
	<!-- </div> -->
	<!-- <ScannerViewer bind:qrResult bind:stopCamera /> -->
	<ScannerViewerO bind:qrResult />
	{#if role == 'admin'}
		<div class="qr-manual">
			<input type="text" bind:value={qrManual} />
			<button
				class="button-hidden"
				on:click={() => {
					qrResult = qrManual
				}}
			>
				<Fa icon={faMagnifyingGlass} size="2x" />
			</button>
		</div>
	{/if}

	<div class="scanner-action">
		{#if loading}
			<button class="button button-green">
				<Fa icon={faSpinner} size="2x" spin />
				Adquiriendo datos...
			</button>
		{/if}
		{#if loadedAdvice}
			<button class="button button-orange">Producto agregado al carrito </button>
		{/if}
		{#if message}
			<NotFound {closeButtonNotFound} />
		{/if}
	</div>
</div>
