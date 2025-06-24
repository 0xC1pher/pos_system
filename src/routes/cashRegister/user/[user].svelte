<script>
	import { goto } from '@roxi/routify'
	import { product, customerEmail } from '@/stores/productStore'
	import { keepInStore, getRole, cleanLocalStorage, isCashRegister } from '@/tools/functions'
	import { cashier } from '@/stores/cashierStore'

	export let user
	user = user.toLowerCase()
	cleanLocalStorage()

	$customerEmail = `attenpo_${user}` + '@attenpo.shop'

	/**
	 * Check if the user is a cashier
	 * @param user
	 * @param name MUST BE
	 * @returns true or false
	 */
	const checkIfCashier = async (email) => {
		const response = await cashier.getCashierSaleorByEmail(email)
		console.log('checkIfCashier', { response })
		const userCashier = response.user.firstName
		const customerId = response.user.id
		if (response.user.isActive) {
			const lastIn = await cashier.updateCashierLastIn(customerId)
			keepInStore('phoneNumber', user == 'Super' ? 'nxsuperadmin' : userCashier)
			keepInStore('userCashRegister', userCashier)
			keepInStore('clientName', userCashier)
			keepInStore('customerId', customerId)
			$goto('/cashRegister')
			return
		}
		$goto('/cashRegister/userDenied')
	}
	checkIfCashier($customerEmail)
</script>
