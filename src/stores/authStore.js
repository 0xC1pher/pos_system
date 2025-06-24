import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime, getActualDateTS } from '@/tools/functions'
import { getCustomerById, changeCustomerActive, getCustomerByEmail, updateCustomerLastIn } from '@/tools/graphql'

const dateTime = printCurrentDateTime()

const authUrl = vars.cashiers

const bearer = import.meta.env.VITE_PAYMENT_KEY

const createAuth = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		getStaffValidationAccepted: async () => {
			const url = `${authUrl}`
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
	}
}

export const authStore = createAuth()
