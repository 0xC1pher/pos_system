<script>
	import { onMount } from 'svelte'
	import { getRandomPhoneNumber, extractDigits } from '@/tools/functions'
	import { checkoutList, customerEmail, product } from '@/stores/productStore'

	import { goto } from '@roxi/routify'

	import { fetchCreateCheckout } from '@/tools/graphql'
	import { vars } from '@/tools/variables'

	const state = vars.state
	// console.log({ state })

	let clientName = ''
	let phoneNumber = ''
	let SKUs

	/*
 	const getSKUs = async () => {
		try {
			const response = await product.getSKUProducts()
			SKUs = response
			console.log('SKU', { response })
		} catch (error) {}
	} */

	onMount(async () => {
		clientName = localStorage.getItem('clientName')
		phoneNumber = localStorage.getItem('phoneNumber')
		// console.log({ phoneNumber, clientName })
		// getSKUs()
	})

	// const ramdomPhoneNumber = getRandomPhoneNumber()

	let ingresando = ''

	const createCheckout = async () => {
		const phoneDigits = extractDigits(phoneNumber)
		// console.log({ phoneDigits })
		$customerEmail = String(phoneDigits) + '@nxlabs.io'
		// console.log({ $customerEmail })
		ingresando = 'Ingresando...'
		try {
			const response = await product.createCheckout($customerEmail)
			$checkoutList = response.checkoutCreate.checkout.id
			localStorage.setItem('checkoutList', $checkoutList)
			$goto('/products')
		} catch (error) {
			console.error('Error fetching createCheckout:', error)
		}
	}

	setTimeout(() => {
		createCheckout()
	}, 500)
</script>

<div class="home-container">
	<div class="homo-logo">
		<img src="/images/attenpo.jpg" alt="" class="Attenpo" />
	</div>
	<!-- <div class="home-client">{clientName !== null ? clientName : ''}</div> -->
	<div class="home-welcome">¡Te damos la Bienvenida!</div>
	<div class="home-message space-down">¿Iniciamos la compra?</div>
	<div class="home-button">
		<!-- <button class="button-home button button-orange" on:click={createCheckout}> -->
		<!-- Iniciar -->
		<!-- {@html `Su número telefónico es:<br> ${ramdomPhoneNumber[0]} (${ramdomPhoneNumber[1]})`} -->
		<!-- </button> -->
		<!-- 
    <button class="button button-green space-down" on:click={createCheckout}>
      Iniciar con número random      
    </button>
     -->
		<!-- 
    <button class="button button-green space-down" on:click={jumpToWhatsApp}>
      Iniciar con WhatsApp
    </button>
     -->
	</div>
	<div class="enter">{ingresando}</div>
</div>
