<script>
	import { onMount } from 'svelte'
	import ReturnMarquee from '@/components/ReturnMarquee.svelte'
	import { goto } from '@roxi/routify'
	import ShowProduct from '@/components/product/ShowProduct.svelte'
	import { checkoutTotal, checkoutLines, productLoaded, product } from '@/stores/productStore'
	import { getStorageJson, getStorage } from '@/tools/functions'

	// let checkoutListId = ''
	// onMount(() => {
	// if (typeof localStorage !== 'undefined') {
	// }
	// })
	const checkoutListId = getStorage('checkoutList') || null
	const productFound = getStorageJson('product-found') || null

	$: console.log()

	console.log({ checkoutListId }, { productFound })

	const variantId = productFound.id
	console.log('productFound', productFound, { variantId })
	let quantity = 1

	const prod = {
		image: productFound.media[0]?.url !== undefined ? productFound.media[0].url : '',
		name: productFound.name,
		price: productFound.channelListings[0].price.amount,
		description: productFound.product.description || '',
		quantity: productFound.stocks[0].quantity,
	}

	console.log({ prod })

	// export let addingErrorMessage = false
	let addingErrorMessage = false

	let errorMessage = ''
	let errorCode = ''
	const addingError = () => {
		addingErrorMessage = true
		setTimeout(() => {
			addingErrorMessage = false
			errorMessage = ''
			errorCode = ''
		}, 3000)
	}

	/**
	 * Add a new product to the shopping list
	 * @checkoutListId checkout id
	 * @variantId product variant id
	 * @quantity product quantity
	 * @errorMessage
	 * @errorCode
	 */
	const checkoutLinesAdd = async () => {
		// console.log('checkoutLinesAdd', checkoutListId, '>>>', variantId, quantity)
		try {
			const response = await product.checkoutLinesAdd(checkoutListId, variantId, quantity)
			// console.log('Agregando...', checkoutListId, variantId, quantity);
			console.log('checkoutListAdd: ', response)
			if (response.checkoutLinesAdd.errors.length > 0) {
				errorCode = response.checkoutLinesAdd.errors[0].code
				errorMessage = response.checkoutLinesAdd.errors[0].message
			}
			$checkoutLines = response.checkoutLinesAdd.checkout.lines
			$checkoutTotal = response.checkoutLinesAdd.checkout.totalPrice.net.amount
			$productLoaded = true
			$goto('/products')
		} catch (error) {
			addingError()
		}
	}

	const returnToScannerViewer = () => {
		$goto('/products')
	}
</script>

<ShowProduct {prod} bind:quantity {addingErrorMessage} {errorCode} {errorMessage} {checkoutLinesAdd} />
