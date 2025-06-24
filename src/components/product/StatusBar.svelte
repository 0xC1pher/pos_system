<script>
	import { goto, url } from '@roxi/routify'
	import { Jumper } from 'svelte-loading-spinners'
	import { checkoutLines, checkoutTotal, product } from '@/stores/productStore'
	import { getStorage, getRole, formatNumber2DecDot } from '@/tools/functions'
	import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
	import { Fa } from 'svelte-fa'
	import { currency } from '@/tools/variables'

	let checkoutListData = []
	let productsCount = 0
	let calculating = false
	let errorMessage = ''

	const checkoutListId = getStorage('checkoutList')

	const logo = `<img src="/images/attenpo-shop.svg" alt=""/>`

	const role = getRole()
	console.log({ role })

	const totals = (data) => {
		$checkoutTotal = data.length != 0 ? data.checkout.totalPrice.net.amount : 0
		productsCount = data.length != 0 ? data.checkout.lines.length : 0
		$checkoutLines = data.length != 0 ? data.checkout.lines : []
		if ($checkoutLines.length == 0) {
			$goto('/products')
		}
	}

	let lines = []
	const loadCheckout = async () => {
		calculating = true
		let checkoutExists = false
		try {
			if (checkoutListId) {
				checkoutListData = await product.loadCheckout(checkoutListId)
				lines = checkoutListData.checkout.lines
				console.log(' checkoutListData ', checkoutListData.checkout)
				// if checkoutExists is null, jumpt to home page
				checkoutExists = checkoutListData.checkout
			}
			if (checkoutExists) {
				totals(checkoutListData)
			} else {
				// $goto('/')
			}
		} catch (error) {
			errorMessage = error.message
		} finally {
			// const salida = totals(checkoutListData);
			// console.log({ salida });
			// console.log({ productsCount })
			calculating = false
		}
	}
	loadCheckout()

	// onMount(() => {
	// 	if (typeof localStorage !== 'undefined') {
	// 	}
	// })

	// $checkoutListId = getStorage('checkoutList')
	// console.log('$checkoutListId', $checkoutListId)

	// setInterval(loadCheckout, vars.statusCartDelay)
	// loadCheckout()

	// $: console.log({ checkoutListData })
	// $: console.log('StatusBar: ', $checkoutLines)
	// $: console.log({ productsCount })

	const gotoProductList = () => {
		if ($checkoutTotal) {
			$goto('/products/list')
		} else {
			$goto('/products')
		}
	}
</script>

<div class="status-bar-container">
	<div class="status-logo">
		{#if role == 'admin'}
			<a href={$url('/cashRegister')}>
				{@html logo}
			</a>
		{:else}
			{@html logo}
		{/if}
	</div>
	<div></div>
	<div class="status-cart-container">
		<button class="status-cart" on:click={gotoProductList}>
			{#if calculating}
				<Jumper size="15" color="#d26c2b" unit="px" duration="1s" />
			{:else}
				<Fa icon={faShoppingCart} size="1x" />
				<div class="status-cart-total">
					<div class="status-cart-currency">
						{currency}
					</div>
					<div class="status-cart-amount">
						{formatNumber2DecDot($checkoutTotal)}
					</div>
				</div>
			{/if}
			<!-- <div class="status-cart-count">{productsCount}</div> -->
		</button>
	</div>
</div>
