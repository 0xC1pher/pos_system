import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime, getRole, getStorage } from '@/tools/functions'

const dateTime = printCurrentDateTime()
const userCashRegister = localStorage.getItem('userCashRegister')

const saleorPhoneNumber = getStorage('saleorPhoneNumber')
const phone = saleorPhoneNumber ? saleorPhoneNumber : ''

const role = getRole()
// const mode = role == 'client' ? 'self-checkout' : 'assisted-checkout'
// let mode = 'self-checkout'
const mode = role == 'client' ? 'self-checkout' : getStorage('service')
console.log('paymentStore MODE', { mode, role })

const createPayment = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		sendPaymentIntentCard: async (reference, amount, serial) => {
			let form = {}
			if (vars.cardTerminal == 'dummy') {
				form = {
					mode: mode,
					phone: phone,
					id: reference,
					cashier_name: userCashRegister === null ? 'selfcheckout' : userCashRegister,
				}
			} else {
				form = {
					mode: mode,
					phone: phone,
					id: reference,
					cashier_name: userCashRegister === null ? 'selfcheckout' : userCashRegister,
					serial_number_pos: serial,
				}
			}
			console.log('sendPaymentIntentCard form sent', form)
			const res = await fetch(vars.servPaymentApiCard, {
				method: 'POST',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + import.meta.env.VITE_PAYMENT_KEY,
				},
			})
			const data = await res.json()
			console.log('sendPaymentIntent res', res)
			console.log('sendPaymentIntent data', data)
			return res
		},
		sendPaymentIntentCash: async (reference, amount, phone = '') => {
			// console.log('REFERENCE', { reference })
			const form = {
				phone: phone,
				id: reference,
				cashier_name: userCashRegister,
				mode: mode,
			}
			console.log('sendPaymentIntentCash form sent', form)
			const res = await fetch(vars.servPaymentApiCash, {
				method: 'POST',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + import.meta.env.VITE_PAYMENT_KEY,
				},
			})
			console.log('sendPaymentIntent', res)
			// const data = await res.json()
			// console.log('sendPaymentIntent', data)
			return res
		},
		sendPaymentHiddenConfirm: async (total, phoneNumber, orderNumber, paymentMethod) => {
			// console.log('REFERENCE', { reference })
			const form = {
				total: parseFloat(total),
				phone_number: phoneNumber,
				order_number: parseInt(orderNumber),
				payment_method: paymentMethod,
				only_send: false,
			}
			console.log('sendPaymentIntentCash form sent', form)
			const res = await fetch(vars.manualConfirm, {
				method: 'POST',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + import.meta.env.VITE_PAYMENT_KEY_MANUAL_CONFIRMATION,
				},
			})
			console.log('sendPaymentIntent', res)
			// const data = await res.json()
			// console.log('sendPaymentIntent', data)
			return res
		},
		onlySendPhoneNumber: async (total, phoneNumber, orderNumber, paymentMethod) => {
			// console.log('REFERENCE', { reference })
			const form = {
				total: parseFloat(total),
				phone_number: phoneNumber,
				order_number: parseInt(orderNumber),
				payment_method: paymentMethod,
				only_send: true,
			}
			console.log('sendPaymentIntentCash form sent', form)
			const res = await fetch(vars.manualConfirm, {
				method: 'POST',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + import.meta.env.VITE_PAYMENT_KEY_MANUAL_CONFIRMATION,
				},
			})
			console.log('sendPaymentIntent', res)
			// const data = await res.json()
			// console.log('sendPaymentIntent', data)
			return res
		},
		checkoutAddVoucher: async (checkout_id, promoCode) => {
			const form = {
				checkout_id: checkout_id,
				code: promoCode,
			}
			console.log('form sent', form)
			const res = await fetch(vars.servPaymentVoucher, {
				method: 'PUT',
				body: JSON.stringify(form),
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + import.meta.env.VITE_PAYMENT_KEY,
				},
			})
			console.log('sendPaymentIntent', res)
			const data = await res.json()
			// console.log('sendPaymentIntent', data)
			return data
		},
	}
}

export const payment = createPayment()
