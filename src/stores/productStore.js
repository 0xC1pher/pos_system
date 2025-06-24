import { writable } from 'svelte/store'
import { vars } from '@/tools/variables'
import { printCurrentDateTime } from '@/tools/functions'
import {
	checkcustomerByEmail,
	checkUserByEmail,
	createCustomer,
	fetchCreateCheckout,
	checkoutCustomerAttach,
	orderCustomerAttach,
	fetchCheckout,
	fetchCheckoutComplete,
	fetchOrderComplete,
	fetchUpdateBillingAddress,
	updateShippingMethod,
	fetchOrderCreateFromCheckout,
	updateOrderMetadata,
	fetchMarkOrderAsPaid,
	fetchGetOrder,
	updateCheckoutLine,
	getSKUProducts,
	fetchProductVariantSku,
	fetchCheckoutLinesAdd,
	fetchSetOrderFullFilled,
	warehouse,
	fetchGetOrderPaymentStatus,
	fetchProductVariantComplete,
	fetchProductVariantMin,
	updateProductVariantStock,
	updateCheckoutLines,
	checkoutAddVoucher,
	fetchconfirmOrder,
	fetchCancelOrder,
	orderPrivateMetadata,
} from '../tools/graphql'

const dateTime = printCurrentDateTime()

// import fetch from 'node-fetch'
// import https from 'https'

// const agent = new https.Agent({
// rejectUnauthorized: false,
// })

export const productFound = writable({})

export const checkoutList = writable('')
export const customerEmail = writable('')
export const checkoutData = writable([])
export const checkoutLines = writable([])
export const checkoutTotal = writable(0)
export const productLoaded = writable(false)
export const checkoutListId = writable('')
export const orderId = writable('')
export const totalCheckoutValues = writable({ discount: 0, totalPayment: 0, totalCheckout: 0 })
export const totalPayment = writable(0)

const createProduct = () => {
	const { subscribe, set } = writable([])
	return {
		subscribe,
		reset: () => set([]),
		getCheckoutList: () => {
			console.log('first check')
		},

		checkUserByEmail: async (email) => {
			const response = await checkUserByEmail(email)
			return response
		},
		checkcustomerByEmail: async (email) => {
			const response = await checkcustomerByEmail(email)
			return response
		},
		createCustomer: async (email, firstName, lastName) => {
			const response = await createCustomer(email, firstName, lastName)
			return response
		},
		createCheckout: async (customerEmail) => {
			const response = await fetchCreateCheckout(customerEmail, [])
			return response
		},
		checkoutCustomerAttach: async (checkoutId, customerId) => {
			const response = await checkoutCustomerAttach(checkoutId, customerId)
			return response
		},
		orderCustomerAttach: async (checkoutId, customerId) => {
			const response = await orderCustomerAttach(checkoutId, customerId)
			return response
		},
		productVariantSku: async (qrText) => {
			const response = await fetchProductVariantSku(qrText)
			return response
		},
		productVariantComplete: async (qrText) => {
			const response = await fetchProductVariantComplete(qrText)
			return response
		},
		productVariantMini: async (qrText) => {
			const response = await fetchProductVariantMin(qrText)
			return response
		},
		loadCheckout: async (checkout) => {
			const response = await fetchCheckout(checkout)
			return response
		},
		loadCheckoutComplete: async (checkout) => {
			const response = await fetchCheckoutComplete(checkout)
			return response
		},
		getOrderComplete: async (orderId) => {
			const response = await fetchOrderComplete(orderId)
			return response
		},
		getSKUProducts: async (checkoutId, lineId, newQuantity) => {
			const { data } = await getSKUProducts()
			let list = []
			console.log('HOLA')

			const productSkus = data.products.edges.map((edge) => {
				const product = edge.node
				const element = {
					name: product.name,
					skus: product.variants.map((variant) => variant.sku).filter(Boolean),
				}
				list.push(element)
			})
			return list
		},
		checkoutLinesAdd: async (checkoutListId, variantId, quantity) => {
			const response = await fetchCheckoutLinesAdd(checkoutListId, variantId, quantity)
			return response
		},
		updateCheckoutLine: async (checkoutId, lineId, newQuantity) => {
			const response = await updateCheckoutLine(checkoutId, lineId, newQuantity)
			return response
		},
		updateBillingAddress: async (checkout) => {
			const response = await fetchUpdateBillingAddress(checkout)
			return response
		},
		updateShippingMethod: async (checkout) => {
			const response = await updateShippingMethod(checkout)
			return response
		},
		orderCreateFromCheckout: async (checkout) => {
			const response = await fetchOrderCreateFromCheckout(checkout)
			return response
		},
		orderPrivateMetadata: async (orderId, key, value) => {
			const response = await orderPrivateMetadata(orderId, key, value)
			return response
		},
		confirmOrder: async (orderId) => {
			const response = await fetchconfirmOrder(orderId)
			return response
		},
		cancelOrder: async (orderId) => {
			const response = await fetchCancelOrder(orderId)
			return response
		},
		updateOrderMetadata: async (irderId, name, value) => {
			const response = await updateOrderMetadata(irderId, name, value)
			console.log('updateOrderMetadata', { response })
			return response
		},
		markOrderAsPaid: async (checkout, user) => {
			const response = await fetchMarkOrderAsPaid(checkout, user)
			return response
		},
		getOrder: async (orderId) => {
			console.log('getOrder async', orderId)
			const response = await fetchGetOrder(orderId)
			return response
		},
		getOrderPaymentStatus: async (checkout) => {
			console.log('getOrderPayment', checkout)
			const response = await fetchGetOrderPaymentStatus(checkout)
			console.log('productStore', { response })
			// const data = await response.json()
			// return data
			return response
		},
		setOrderFullFilled: async (orderId, linesOrder) => {
			console.log('getOrder async', orderId)
			const fulfillmentLines = linesOrder.map((line) => ({
				orderLineId: line.id,
				stocks: [
					{
						quantity: line.quantity,
						warehouse,
					},
				],
			}))
			// console.log('989898', { fulfillmentLines })
			const orderLines = { lines: fulfillmentLines }
			// orderLines.lines = fulfillmentLines
			console.log('123456', orderLines)
			// return orderLines

			const response = await fetchSetOrderFullFilled(orderId, orderLines)
			return response
		},
		updateProductVariantStock: async (sku, quantity) => {
			console.log('updateProductVariantStock', { sku, quantity })
			const response = await updateProductVariantStock(sku, quantity)
			return response
		},
		checkoutAddVoucher: async (checkoutId, voucherId) => {
			// console.log('checkoutAddVoucher', { checkoutId, voucherId })
			const response = await checkoutAddVoucher(checkoutId, voucherId)
			return response
		},
	}
}

export const product = createProduct()
