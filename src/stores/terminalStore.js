import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime } from '@/tools/functions'

const dateTime = printCurrentDateTime()

const terminalsUrl = vars.terminals

const bearer = import.meta.env.VITE_PAYMENT_KEY

const createTerminals = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		getTerminals: async () => {
			const url = `${terminalsUrl}`
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + bearer,
				},
			})
			const data = await res.json()
			console.log('getTerminals', { data })
			return data
		},

		addTerminal: async (serial, mode, name) => {
			const form = {
				serial,
				mode,
				name,
			}
			console.log('form sent', form)
			const res = await fetch(terminalsUrl, {
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
		updateTerminal: async (terminal) => {
			const url = `${terminalsUrl}/${terminal.id}`
			let mode = ''
			if (terminal.cashier && terminal.user) {
				mode = 'both'
			} else if (terminal.cashier) {
				mode = 'cashier'
			} else if (terminal.user) {
				mode = 'user'
			} else {
				mode = 'none'
				terminal.active = false
			}
			const form = {
				serial: terminal.serial,
				mode,
				active: terminal.active,
				name: terminal.name,
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
		editTerminal: async () => {
			const id = '20756db2-0047-43c2-830e-a4a7e69e3d99'

			const url = `${terminalsUrl}/${id}`
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
		delTerminal: async (id) => {
			const url = `${terminalsUrl}/${id}`
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + bearer,
					'Content-Type': 'application/json',
				},
			})
			const data = await res.json()
			console.log('delTerminal', { data })
			return data
		},
	}
}

export const terminals = createTerminals()
