<script>
	import { getRandomPhoneNumber, extractDigits } from '../tools/functions'
	import { checkoutList, customerEmail } from '../stores/productStore'

	import { goto } from '@roxi/routify'
	import { fetchCreateCheckout } from '@/tools/graphql'

	const phoneNumber = getRandomPhoneNumber()

	let ingresando = ''

	const createCheckout = async () => {
		const phoneDigits = extractDigits(phoneNumber)
		// console.log({ phoneDigits })
		$customerEmail = String(phoneDigits) + '@nxlabs.io'
		// console.log({ $customerEmail })
		ingresando = 'Ingresando...'
		try {
			const response = await fetchCreateCheckout($customerEmail, [])
			$checkoutList = response.checkoutCreate.checkout.id
			const checkoutListId = response.checkoutCreate.checkout.id
			localStorage.setItem('checkoutList', checkoutListId)
			$goto('/products')
		} catch (error) {
			console.error('Error fetching createCheckout:', error)
		}
	}
</script>

<div class="home-container">
	<div class="homo-logo">
		<img src="/images/attenpo.jpg" alt="" class="Attenpo" />
	</div>

	<div class="home-welcome">¡Bienvenido!</div>
	<div class="home-message space-down">Continua tu compra identificándote con WhatsApp</div>
	<div class="home-button">
		<button class="button button-green space-down" on:click={createCheckout}>
			Iniciar con WhatsAppp
			<!-- {@html `Su número telefónico es:<br> ${phoneNumber[0]} (${phoneNumber[1]})`} -->
		</button>
	</div>
	<div class="enter">{ingresando}</div>
</div>
