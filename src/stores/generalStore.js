import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime } from '@/tools/functions'

export const useFrontalCamera = writable(false)
const dateTime = printCurrentDateTime()
export const backLink = writable('')
export const NoBackButton = writable(false)

const createGeneral = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		cleanStore: () => {
			localStorage.setItem('attenpo-order-id', '')
			localStorage.setItem('attenpo-order-total', '')
			localStorage.setItem('checkoutList', '')
			localStorage.setItem('userCashRegister', '')
			localStorage.setItem('saleorPhoneNumber', '')
			localStorage.setItem('lastShop', dateTime)
		},
	}
}

export const general = createGeneral()
