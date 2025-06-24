<script>
	// import { Jumper } from 'svelte-loading-spinners'
	import { goto } from '@roxi/routify'
	import { checkoutLines, checkoutTotal, checkoutListId } from '@/stores/productStore'
	import { fetchCheckout } from '@/tools/graphql'
	import { Fa } from 'svelte-fa'
	import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
	import { getStorage, keepInStore } from '@/tools/functions'
	import { backLink } from '@/stores/generalStore'

	// $backLink = $backLink == '.' ? '.' : '/products/list'

	// $: console.log('backLink', $backLink)

	const totalPayment = getStorage('total-payment') || ''
	// console.log('totalPayment', totalPayment)

	let checkoutListData = []
	let productsCount = 0
	let calculating = false
	let errorMessage = ''

	$checkoutListId = getStorage('checkoutList')
	console.log('$checkoutListId', $checkoutListId)
	const loadCheckout = async () => {
		calculating = true
		try {
			if ($checkoutListId) {
				checkoutListData = await fetchCheckout($checkoutListId)
				console.log({ checkoutListData })
			}
			totals(checkoutListData)
			console.log({ productsCount })
		} catch (error) {
			errorMessage = error.message
		} finally {
			// const salida = totals(checkoutListData);
			// console.log({ salida });
			calculating = false
		}
	}
	loadCheckout()

	const totals = (data) => {
		$checkoutTotal = data.length != 0 ? data.checkout.totalPrice.net.amount : 0
		keepInStore('total-payment', $checkoutTotal)
		productsCount = data.length != 0 ? data.checkout.lines.length : 0
		$checkoutLines = data.length != 0 ? data.checkout.lines : []
	}

	$: console.log({ checkoutListData })
	$: console.log('StatusBar: ', $checkoutLines)
	$: console.log({ productsCount })

	const gotoProductList = () => {
		if (totalPayment != '') {
			$goto($backLink)
		} else {
			$goto('/products')
		}
	}
</script>

<div class="status-bar-container">
	<div class="status-logo">
		<img src="/images/attenpo-shop.svg" alt="" />
	</div>
	<div></div>
	<div class="status-cart-container">
		<button class="status-cart" on:click={gotoProductList}>
			<Fa icon={faArrowLeftLong} />
			Volver
		</button>
	</div>
</div>
