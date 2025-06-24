import { GraphQLClient, gql } from 'graphql-request'
import { vars, enviroment } from '@/tools/variables'
import { getRole } from '@/tools/functions'
import { getActualDateTS } from '@/tools/functions'
import { orderId } from '@/stores/productStore'

const role = getRole()

const mode = role == 'client' ? 'self-checkout' : 'assisted-checkout'
const channel = role == 'client' ? 'self-checkout' : 'offline'

export const warehouse = vars.warehouse

const saleorToken = vars.saleorToken
const endpoint = vars.urlSaleor

const client = new GraphQLClient(endpoint, {
	headers: {
		'Authorization-Bearer': saleorToken,
	},
})

const getData = async (query, variables) => {
	try {
		const data = await client.request(query, variables)
		return data
	} catch (error) {
		console.error('Error fetching:', error)
		throw error
	}
}

/**
 *
 * @param {*} email
 * @returns user data if exists
 */
export async function checkUserByEmail(email) {
	const query = gql`
		query checkuserByEmail($email: String!) {
			user(email: $email) {
				id
				firstName
				lastName
			}
		}
	`

	const variables = {
		email,
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} email
 * @returns customer data if ex
 */
export async function checkcustomerByEmail(email) {
	const query = gql`
		query customerByEmail($email: String!) {
			customers(filter: { search: $email }, first: 10) {
				edges {
					node {
						id
						email
						firstName
						lastName
						isActive
						dateJoined
					}
				}
			}
		}
	`

	const variables = {
		email,
	}

	return getData(query, variables)
}

/**
 * If customer does not exist, create
 * @param {*} email cellphone@attenpo.shop
 * @param {*} firstName from user link-income
 * @param {*} lastName ''
 * @param {*} isActive true
 * @returns id or data.customerCreate.user = null
 */
export async function createCustomer(email, firstName, lastName, isActive) {
	const query = gql`
		mutation customerCreate($input: UserCreateInput!) {
			customerCreate(input: $input) {
				user {
					id
					email
					firstName
					lastName
					isActive
				}
				errors {
					field
					message
					code
				}
			}
		}
	`

	const variables = {
		input: {
			email,
			firstName,
			lastName,
			isActive: true,
			note: 'Customr created by selfCheckoutApp',
		},
	}

	return getData(query, variables)
}

/**
 * Create ShoppingCart object
 * @email phoneNumber@nxlabas.io String
 * @lines [] empty array
 * @returns
 */
export async function fetchCreateCheckout(email, lines) {
	const query = gql`
		mutation checkoutCreate($email: String!, $lines: [CheckoutLineInput!]!, $channel: String!) {
			checkoutCreate(input: { email: $email, lines: $lines, channel: $channel }) {
				checkout {
					id
					email
					user {
						id
						email
					}
					lines {
						id
						quantity
						variant {
							id
							name
						}
					}
				}
			}
		}
	`

	const variables = {
		email,
		lines,
		channel,
	}

	console.log('variables', variables)

	return getData(query, variables)
}

/**
 * After checkout is created, is attached to the customerId
 * @param {*} checkoutId
 * @param {*} customerId
 * @returns
 */
export async function checkoutCustomerAttach(checkoutId, customerId) {
	const query = gql`
		mutation checkoutCustomerAttach($checkoutId: ID!, $customerId: ID!) {
			checkoutCustomerAttach(checkoutId: $checkoutId, customerId: $customerId) {
				checkout {
					id
					email
					user {
						id
						email
						firstName
						lastName
					}
				}
				checkoutErrors {
					field
					message
					code
				}
			}
		}
	`

	const variables = {
		checkoutId,
		customerId,
	}

	return getData(query, variables)
}

/**
 * After payment is appoved (assited checkout), customer is attached to the orderId
 * @param {*} orderId
 * @param {*} email
 * @returns
 */
export async function orderCustomerAttach(orderId, email) {
	const query = gql`
		mutation attachCustomerToOrder($orderId: ID!, $email: String!) {
			orderUpdate(id: $orderId, input: { userEmail: $email }) {
				order {
					id
					userEmail
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		orderId,
		email,
	}

	return getData(query, variables)
}

export async function orderPrivateMetadata(orderId, key, value) {
	const query = gql`
		mutation updateOrderPrivateMetadata($orderId: ID!, $key: String!, $value: String!) {
			updatePrivateMetadata(id: $orderId, input: [{ key: $key, value: $value }]) {
				item {
					... on Order {
						id
						privateMetadata {
							key
							value
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		orderId,
		key,
		value,
	}

	return getData(query, variables)
}

export async function getCustomerByEmail(email) {
	const query = gql`
		query getCustomerByEmail($email: String!) {
			user(email: $email) {
				id
				email
				firstName
				lastName
				isActive
				dateJoined
			}
		}
	`

	const variables = {
		email,
	}

	return getData(query, variables)
}

export async function updateCustomerLastIn(userId) {
	const query = gql`
		mutation updateCustomerPrivateMetadata($userId: ID!, $key: String!, $value: String!) {
			updatePrivateMetadata(id: $userId, input: [{ key: $key, value: $value }]) {
				item {
					... on User {
						id
						email
						privateMetadata {
							key
							value
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		userId,
		key: 'last_in',
		value: getActualDateTS(),
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} id
 * @returns customer data if exists
 */
export async function getCustomerById(id) {
	const query = gql`
		query getCustomerById($id: ID!) {
			user(id: $id) {
				id
				email
				firstName
				lastName
				isActive
				dateJoined
			}
		}
	`

	const variables = {
		id,
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} id
 * @param {*} active
 * @returns customer data if exists
 */
export async function changeCustomerActive(id, active) {
	const query = gql`
		mutation changeCustomerActive($id: ID!, $active: Boolean!) {
			customerUpdate(id: $id, input: { isActive: $active }) {
				user {
					id
					email
					firstName
					lastName
					isActive
					dateJoined
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		id,
		active,
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} id
 * @returns product variant data, if exists
 */
export async function fetchProductVariant(id) {
	const query = gql`
		query productVariantSingle($id: ID!) {
			productVariant(id: $id, channel: $channel) {
				id
				name
				product {
					description
					weight {
						unit
						value
					}
				}
				media {
					alt
					url
				}
				channelListings {
					price {
						amount
						currency
					}
				}
			}
		}
	`

	const variables = {
		id,
		channel,
	}

	return getData(query, variables)
}

/**
 *
 * @param sku variant sku
 * @returns productVariant data
 */
export async function fetchProductVariantSku(sku) {
	const query = gql`
		query productVariantSku($sku: String!, $channel: String!) {
			productVariant(sku: $sku, channel: $channel) {
				id
				name
				quantityAvailable
				product {
					description
					isAvailable
					isAvailableForPurchase
					weight {
						unit
						value
					}
				}
				media {
					alt
					url
				}
				channelListings {
					price {
						amount
						currency
					}
				}
				stocks {
					quantity
					quantityReserved
					quantityAllocated
				}
			}
		}
	`

	const variables = {
		sku,
		channel,
	}

	return getData(query, variables)
}

/**
 * fetch complete data from product variant
 * @param {*} sku
 * @returns
 */
export async function fetchProductVariantComplete(sku) {
	const query = gql`
		query productVariantSku($sku: String!, $channel: String!) {
			productVariant(sku: $sku, channel: $channel) {
				name
				product {
					pricing {
						priceRange {
							start {
								net {
									amount
									currency
								}
							}
							stop {
								net {
									amount
									currency
								}
							}
						}
						priceRangeUndiscounted {
							start {
								net {
									amount
									currency
								}
							}
							stop {
								net {
									amount
									currency
								}
							}
						}
						displayGrossPrices
						discount {
							net {
								amount
								currency
							}
						}
					}
				}
				pricing {
					price {
						net {
							currency
							amount
						}
					}
					priceUndiscounted {
						net {
							currency
							amount
						}
					}
					discount {
						net {
							amount
							currency
						}
					}
				}
				preorder {
					globalSoldUnits
					globalThreshold
					endDate
				}
				quantityAvailable
				quantityLimitPerCustomer
				quantityOrdered
				trackInventory
				stocks {
					quantity
					quantityReserved
					quantityAllocated
				}
				product {
					id
					name
					isAvailable
					isAvailableForPurchase
					availableForPurchaseAt
					channelListings {
						id
						isPublished
						isAvailableForPurchase
						visibleInListings
						availableForPurchaseAt
					}
				}
			}
		}
	`

	const variables = {
		sku,
		channel,
	}

	return getData(query, variables)
}

/**
 * fetch minimun data from product variant: quantity
 * @param {*} sku
 * @returns
 */
export async function fetchProductVariantMin(sku) {
	const query = gql`
		query productVariantSku($sku: String!, $channel: String!) {
			productVariant(sku: $sku, channel: $channel) {
				name
				id
				media {
					alt
					url
				}
				product {
					variants {
						sku
					}
				}
				channelListings {
					costPrice {
						amount
						currency
					}
					price {
						amount
						currency
					}
				}
				stocks {
					quantity
					quantityReserved
					quantityAllocated
				}
			}
		}
	`

	const variables = {
		sku,
		channel,
	}

	return getData(query, variables)
}

/**
 *
 * @returns list of channel products
 */
export async function getSKUProducts() {
	const query = gql`
		query getAllProductVariants {
			products(first: 100) {
				edges {
					node {
						variants {
							sku
						}
					}
				}
			}
		}
	`

	const variables = {}

	return getData(query, variables)
}

/**
 * Add product to the shopping cart
 * @id checoutList id
 * @variantId productId
 * @quantity quantity of products to add
 * @returns product	object or error object
 */
export async function fetchCheckoutLinesAdd(id, variantId, quantity) {
	const query = gql`
		mutation checkoutLinesAdd($id: ID!, $variantId: ID!, $quantity: Int!) {
			checkoutLinesAdd(id: $id, lines: [{ variantId: $variantId, quantity: $quantity }]) {
				checkout {
					id
					lines {
						id
						quantity
						variant {
							id
							name
							media {
								url
								alt
							}
						}
						totalPrice {
							net {
								amount
								currency
							}
						}
					}
					totalPrice {
						net {
							amount
							currency
						}
					}
				}
				errors {
					code
					field
					message
				}
			}
		}
	`

	const variables = {
		id,
		variantId,
		quantity,
	}

	return getData(query, variables)
}

/**
 *
 * @id checkout list id
 * @returns checkout list data
 */
export async function fetchCheckout(id) {
	const query = gql`
		query getCheckout($id: ID!) {
			checkout(id: $id) {
				id
				lines {
					id
					quantity
					variant {
						id
						name
						quantityAvailable
						media {
							url
							alt
						}
					}
					totalPrice {
						net {
							amount
							currency
						}
					}
				}
				totalPrice {
					net {
						amount
						currency
					}
				}
			}
		}
	`

	const variables = { id }

	return getData(query, variables)
}

/**
 *
 * @id checkout list id
 * @returns checkout list data
 */
export async function fetchOrderComplete(orderId) {
	const query = gql`
		query getOrder($orderId: ID!) {
			order(id: $orderId) {
				id
				number
				created
				status
				userEmail
				isPaid
				total {
					gross {
						amount
						currency
					}
				}
				subtotal {
					gross {
						amount
						currency
					}
				}
				discounts {
					amount {
						currency
						amount
					}
				}
				voucher {
					code
					discountValueType
					discountValue
				}
				giftCards {
					displayCode
					currentBalance {
						amount
						currency
					}
				}
				shippingPrice {
					gross {
						amount
						currency
					}
				}
				lines {
					id
					quantity
					totalPrice {
						gross {
							amount
							currency
						}
					}
					variant {
						id
						name
						sku
						media {
							url
							alt
						}
						pricing {
							price {
								gross {
									amount
									currency
								}
							}
						}
					}
				}
				shippingAddress {
					firstName
					lastName
					streetAddress1
					city
					postalCode
					country {
						code
						country
					}
				}
				billingAddress {
					firstName
					lastName
					streetAddress1
					city
					postalCode
					country {
						code
						country
					}
				}
			}
		}
	`

	const variables = { orderId }

	return getData(query, variables)
}

/**
 *
 * @id checkout list id
 * @returns checkout list data
 */
export async function fetchCheckoutComplete(checkoutId) {
	const query = gql`
		query getCheckoutComplete($checkoutId: ID!) {
			checkout(id: $checkoutId) {
				id
				token
				email
				totalPrice {
					gross {
						amount
						currency
					}
				}
				subtotalPrice {
					gross {
						amount
						currency
					}
				}
				discount {
					amount
					currency
				}
				voucherCode
				giftCards {
					displayCode
					currentBalance {
						amount
						currency
					}
				}
				shippingPrice {
					gross {
						amount
						currency
					}
				}
				lines {
					id
					quantity
					totalPrice {
						gross {
							amount
							currency
						}
					}
					variant {
						id
						name
						sku
						media {
							url
							alt
						}
						pricing {
							price {
								gross {
									amount
									currency
								}
							}
						}
					}
				}
				shippingAddress {
					firstName
					lastName
					streetAddress1
					city
					postalCode
					country {
						code
						country
					}
				}
				billingAddress {
					firstName
					lastName
					streetAddress1
					city
					postalCode
					country {
						code
						country
					}
				}
			}
		}
	`
	const variables = { checkoutId }

	return getData(query, variables)
}

/**
 *
 * @param {*} checkoutId
 * @param {*} lineId
 * @param {*} newQuantity
 * @returns checkout line data
 */
export async function updateCheckoutLine(checkoutId, lineId, newQuantity) {
	const query = gql`
		mutation UpdateCheckoutLine($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
			checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
				checkout {
					id
					lines {
						id
						quantity
						variant {
							id
							name
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		checkoutId: checkoutId,
		lines: [
			{
				lineId: lineId,
				quantity: newQuantity,
			},
		],
	}

	return getData(query, variables)
}

/**
 *
 * @checkoutId
 * @billingAddress fixed Attenpo Address *
 * @returns
 */
export async function fetchUpdateBillingAddress(checkoutId) {
	const query = gql`
		mutation updateCheckoutAddresses(
			$checkoutId: ID!
			$billingAddress: AddressInput!
			$shippingAddress: AddressInput!
		) {
			checkoutBillingAddressUpdate(checkoutId: $checkoutId, billingAddress: $billingAddress) {
				checkout {
					id
					billingAddress {
						firstName
						lastName
						streetAddress1
						city
						postalCode
						country {
							code
						}
					}
				}
				errors {
					field
					message
				}
			}
			checkoutShippingAddressUpdate(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
				checkout {
					id
					shippingAddress {
						firstName
						lastName
						streetAddress1
						city
						postalCode
						country {
							code
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		checkoutId,
		billingAddress: {
			firstName: 'Attenpo',
			lastName: 'Shop',
			streetAddress1: 'Avenida Insurgentes Sur 300',
			city: 'Ciudad de México',
			postalCode: '01000',
			country: 'MX',
			countryArea: 'CDMX',
		},
		shippingAddress: {
			firstName: 'Attenpo',
			lastName: 'Shop',
			streetAddress1: 'Avenida Insurgentes Sur 300',
			city: 'Ciudad de México',
			postalCode: '01000',
			country: 'MX',
			countryArea: 'CDMX',
		},
	}

	return getData(query, variables)
}

export async function updateShippingMethod(checkoutId) {
	const query = gql`
		mutation updateDeliveryMethod($id: ID!, $deliveryMethodId: ID!) {
			checkoutDeliveryMethodUpdate(id: $id, deliveryMethodId: $deliveryMethodId) {
				checkout {
					id
					deliveryMethod {
						__typename
						... on ShippingMethod {
							id
							name
						}
						... on Warehouse {
							id
							name
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		id: checkoutId,
		deliveryMethodId: vars.saleorPickUpMethodID,
	}

	return getData(query, variables)
}

/**
 * Create order from checkout list
 * @id checkoutId
 * @returns
 */
export async function fetchOrderCreateFromCheckout(checkoutId) {
	const query = gql`
		mutation createOrder($id: ID!) {
			orderCreateFromCheckout(id: $id) {
				order {
					id
					number
					status
					total {
						gross {
							amount
							currency
						}
					}
					user {
						email
					}
					lines {
						productName
						quantity
						unitPrice {
							gross {
								amount
								currency
							}
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		id: checkoutId,
	}

	return getData(query, variables)
}

/**
 * Confirm order
 * @param {*} orderId
 * @returns
 */
export async function fetchconfirmOrder(orderId) {
	const query = gql`
		mutation confirmOrder($orderId: ID!) {
			orderConfirm(id: $orderId) {
				order {
					id
					number
					status
				}
				errors {
					field
					message
				}
			}
		}
	`
	const variables = {
		orderId,
	}

	return getData(query, variables)
}

/**
 * Cancel order
 * @param {*} orderId
 * @returns
 */
export async function fetchCancelOrder(orderId) {
	const query = gql`
		mutation cancelOrder($orderId: ID!) {
			orderCancel(id: $orderId) {
				order {
					id
					number
					status
				}
				errors {
					field
					message
				}
			}
		}
	`
	const variables = {
		orderId,
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} id
 * @param {*} name
 * @param {*} value
 * @returns add metadata to order
 */
export async function updateOrderMetadata(id, name, value) {
	const query = gql`
		mutation updateOrderMetadata($orderId: ID!, $key: String!, $value: String!) {
			updateMetadata(id: $orderId, input: [{ key: $key, value: $value }], typeName: "Order") {
				item {
					... on Order {
						id
						metadata {
							key
							value
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		id,
		key: name,
		value,
	}

	return getData(query, variables)
}

/**
 * Create order from checkout list
 * @id checkoutId
 * @returns
 */
export async function fetchMarkOrderAsPaid(id, user) {
	const query = gql`
		mutation markOrderAsPaid($id: ID!, $transactionReference: String) {
			orderMarkAsPaid(id: $id, transactionReference: $transactionReference) {
				order {
					id
					status
					paymentStatus
					total {
						gross {
							amount
							currency
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		id,
		transactionReference: 'Cash payment by ' + user,
	}

	return getData(query, variables)
}

/**
 *
 * @param {*} orderId
 * @param {*} lines
 * @returns orderFulFill.error
 */
export async function fetchSetOrderFullFilled(orderId, lines) {
	const query = gql`
		mutation fulfillOrder($orderId: ID!, $input: OrderFulfillInput!) {
			orderFulfill(input: $input, order: $orderId) {
				order {
					id
				}
				errors {
					code
					field
					message
				}
			}
		}
	`

	const variables = {
		orderId,
		input: lines,
	}

	// return true
	return getData(query, variables)
}

/**
 *
 * @id get order status information
 * data.order.paymentStatus = "FULLY_CHARGED"
 * @returns
 */
export async function fetchGetOrder(id) {
	const query = gql`
		query getOrder($id: ID!) {
			order(id: $id) {
				id
				number
				status
				paymentStatus
				isPaid
				total {
					gross {
						amount
						currency
					}
				}
				user {
					email
				}
				lines {
					id
					productName
					quantity
					unitPrice {
						gross {
							amount
							currency
						}
					}
				}
				metadata {
					key
					value
				}
				privateMetadata {
					key
					value
				}
			}
		}
	`

	const variables = {
		id,
	}

	return getData(query, variables)
}

/**
 *
 * @id get order payment status
 * paid
 * data.order.paymentStatus = "FULLY_CHARGED"
 *
 * not paid
 * data.order = null
 *
 * @returns
 */
export async function fetchGetOrderPaymentStatus(orderId) {
	const query = gql`
		query getOrder($externalReference: String!) {
			order(externalReference: $externalReference) {
				id
				number
				status
				paymentStatus
				isPaid
			}
		}
	`

	const variables = {
		externalReference: orderId,
	}

	return getData(query, variables)
}

/**
 * Refresh checkout, restart stockReservationExpires
 * @param {*} checkoutId
 * @returns
 */
export async function updateCheckoutLines(checkoutId, lines) {
	const query = gql`
		mutation updateCheckoutLines($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
			checkoutLinesUpdate(checkoutId: $checkoutId, lines: $lines) {
				checkout {
					id
					stockReservationExpires
					lines {
						id
						quantity
						variant {
							id
							name
						}
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		checkoutId,
		lines,
	}

	return getData(query, variables)
}

/**
 * Change stock quantity
 * @param {*} sku
 * @param {*} quantity
 * @returns
 */
export async function updateProductVariantStock(sku, quantity) {
	const query = gql`
		mutation updateProductVariantStock($sku: String, $stocks: [StockInput!]!) {
			productVariantStocksUpdate(sku: $sku, stocks: $stocks) {
				productVariant {
					id
					name
					stocks {
						warehouse {
							id
							name
						}
						quantity
					}
				}
				errors {
					field
					message
				}
			}
		}
	`

	const variables = {
		sku,
		stocks: [
			{
				warehouse,
				quantity,
			},
		],
	}

	return getData(query, variables)
}

// VOUCHERS
/**
 * Add voucher to the checkout
 * @param {*} checkoutId
 * @param {*} voucherId
 * @returns
 */
export async function checkoutAddVoucher(checkoutId, voucherId) {
	const query = gql`
		mutation checkoutAddPromoCode (id: ID!, promoCode: String!){
		  checkoutAddPromoCode(
    id: $checkoutId,
    promoCode: $promoCode,
  ) {
    checkout {
      id
      lines {
        id
        quantity
        variant {
          name
        }
      }
      discount {
        amount
        currency
      }
      discountName
      voucher {
        id
        code
        name
        type
        currency
        discountValue
        discountValueType
      }
      voucherCode
      totalPrice {
        net {
          amount
          currency
        }
      }
      subtotalPrice {
        net {
          amount
          currency
        }
      }
      totalBalance {
        amount
        currency
      }
      quantity
      stockReservationExpires
    }
    errors {
      code
      field
      message
    }
  }
}
	`

	const variables = {
		checkoutId,
		promoCode: voucherId,
	}

	return getData(query, variables)
}
