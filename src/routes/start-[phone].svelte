<script>
	export let phone

	import { goto } from '@roxi/routify'
	import { extractDigits } from '@/tools/functions'
	import { checkoutList, customerEmail } from '@/stores/productStore'
	import { fetchCreateCheckout } from '@/tools/graphql'

	console.log({ phone })
	const phoneNumber = phone

	console.log({ phoneNumber })
	let ingresando = ''
	// ingresando = 'Ingresando...';

	const createCheckout = async () => {
		const phoneDigits = extractDigits(phoneNumber)
		console.log({ phoneDigits })
		$customerEmail = String(phoneDigits) + '@nxlabs.io'
		console.log({ $customerEmail })
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
	createCheckout()
</script>

<div class="home-container">
	<div class="homo-logo">
		<img src="/images/attenpo.jpg" alt="" class="Attenpo" />
	</div>

	<div class="home-welcome">¡Bienvenido!</div>
	<div class="home-message space-down"></div>
	<div class="home-button"></div>
	<div class="enter">{ingresando}</div>
</div>
