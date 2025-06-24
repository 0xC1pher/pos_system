import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime, getActualDateTS } from '@/tools/functions'
import { getCustomerById, changeCustomerActive, getCustomerByEmail, updateCustomerLastIn } from '@/tools/graphql'

const dateTime = printCurrentDateTime()

const cashiersUrl = vars.cashiers

const bearer = import.meta.env.VITE_PAYMENT_KEY

const createCashiers = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		getCashiers: async () => {
			const url = `${cashiersUrl}`
			// console.log('getCashiers', url)
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + bearer,
				},
			})
			const data = await res.json()
			// console.log('getCashiers', data, res)
			return data
		},
		getCashier: async (cashierId) => {
			const url = `${cashiersUrl}/${cashierId}`
			// console.log('getCashier', url)
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + bearer,
				},
			})
			const data = await res.json()
			// console.log('getCashier', data, res)
			return data
		},
		getCashierSaleorByCashierId: async (cashierId) => {
			const response = await getCustomerById(cashierId)
			console.log('getCashierSaleor', { response })
			return response
		},
		getCashierSaleorByEmail: async (email) => {
			const response = await getCustomerByEmail(email)
			console.log('getCashierSaleorByEmail', { response })
			return response
		},
		changeCashierActive: async (cashierId, active) => {
			const response = await changeCustomerActive(cashierId, active)
			console.log('changeCustomerActive', { response })
			return response
		},
		updateCashierLastIn: async (cashierId) => {
			const response = await updateCustomerLastIn(cashierId)
			console.log('updateCustomerLastIn', { response })
			return response
		},
		delCashier: async (id) => {
			const url = `${cashiersUrl}/${id}`
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + bearer,
					'Content-Type': 'application/json',
				},
			})
			const data = await res.json()
			// console.log('delTerminal', { data })
			return data
		},
		addCashier: async (firstName, lastName) => {
			const url = `${cashiersUrl}`
			const name = `attenpo_${firstName}`
			const form = {
				first_name: name,
				last_name: lastName,
				phone: '',
				email: `attenpo_${firstName}@attenpo.shop`,
				last_in: getActualDateTS(),
				active: true,
			}
			console.log('form sent', form)
			const res = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + bearer,
				},
			})
			console.log('sendPaymentIntent', res)
			return res
		},
		updateCashier: async (cashier) => {
			const url = `${cashiersUrl}/${cashier.id}`
			const form = {
				firstName: cashier.firstName,
				lastName: cashier.lastName,
				phone: '',
				email: cashier.email,
				last_in: parseInt(cashier.last_in),
				isActive: cashier.isActive,
			}
			console.log('form sent', form)
			const res = await fetch(url, {
				method: 'UPDATE',
				body: JSON.stringify(form),
				headers: {
					Authorization: 'Bearer ' + bearer,
					'Content-Type': 'application/json',
				},
			})
			// console.log('sendPaymentIntent', res)
			const data = await res.json()
			console.log('sendPaymentIntent', data)
			return res
		},
		editTerminal: async () => {
			const id = '20756db2-0047-43c2-830e-a4a7e69e3d99'

			const url = `${cashiersUrl}/${id}`
			const form = {
				active: false,
				mode: 'both',
				name: 'Terminal 2',
				serial: 'P5221108000605',
			}

			console.log('form sent', form)
			const res = await fetch(url, {
				method: 'PUT',
				body: JSON.stringify(form),
				headers: {
					Authorization: 'Bearer ' + bearer,
					'Content-Type': 'application/json',
				},
			})
			// console.log('sendPaymentIntent', res)
			const data = await res.json()
			console.log('sendPaymentIntent', data)
			return res
		},
	}
}

export const cashier = createCashiers()
