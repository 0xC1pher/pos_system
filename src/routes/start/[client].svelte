<script>
	import { goto } from '@roxi/routify'
	import {
		extractDigits,
		keepInStore,
		cleanLocalStorage,
		checkAndRequestCameraPermission,
		isIPhone,
	} from '@/tools/functions'
	import { checkoutList, customerEmail, product } from '@/stores/productStore'
	import { vars } from '@/tools/variables'

	async function handleCameraAccess() {
		if (isIPhone()) {
			const hasPermission = await checkAndRequestCameraPermission()
			if (hasPermission) {
				// Procede a usar la cámara
				return
			} else {
				// Informa al usuario que necesitas acceso a la cámara
				console.log('NO CAMERA ACCESS')
				$goto('/')
			}
		} else {
			// Comportamiento normal para otros dispositivos
			console.log('NO ES iPhone')
		}
	}
	handleCameraAccess()

	cleanLocalStorage()

	let ingresando = ''

	// let phoneNumber, clientName
	export let client
	const phoneNumber = client.split('-')[0]
	const clientName = client.split('-')[1]
	const lastName = ''
	// console.log('DATA', { phoneNumber }, { clientName })

	const state = vars.state
	console.log({ state })

	const createCheckout = async () => {
		const phoneDigits = extractDigits(phoneNumber)
		$customerEmail = String(phoneDigits) + '@attenpo.shop'
		ingresando = 'Ingresando...'
		let customerId = null
		try {
			const customerExists = await product.checkUserByEmail($customerEmail)
			console.log('CHECK USER BY EMAIL', phoneNumber, clientName, customerExists.user)
			keepInStore('saleorPhoneNumber', phoneNumber)
			if (!customerExists.user) {
				console.log('NO EXISTE', $customerEmail)
				const customer = await product.createCustomer($customerEmail, clientName, lastName)
				customerId = customer.customerCreate.user.id
				console.log({ customerId })
			} else {
				customerId = customerExists.user.id
				console.log('EXISTE', { customerId })
			}
			console.log('customerEmail', $customerEmail)
			const newCheckout = await product.createCheckout($customerEmail)
			$checkoutList = newCheckout.checkoutCreate.checkout.id
			keepInStore('checkoutList', $checkoutList)
			const attaching = await product.checkoutCustomerAttach($checkoutList, customerId)
			console.log('Attach:', attaching)
			ingresando = ''
			$goto('/products')
		} catch (error) {
			console.error(error)
			ingresando = ''
			console.log('Error al crear carrito de compras')
		}
	}
	createCheckout()
</script>

<div class="home-container">
	<div class="homo-logo">
		<img src="/images/attenpo.jpg" alt="" class="Attenpo" />
	</div>
	<div class="home-welcome">¡Te damos la Bienvenida!</div>
	<div class="home-message">¿Iniciamos la<br /> compra?</div>
	<div class="home-entering">
		{ingresando}
	</div>
</div>
