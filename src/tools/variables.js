// production

export const phoneNumber = 525541777724
export const attenpoPhoneNumber = '525541777724'
export const serialPOSClip = ['P5221108001077', 'P5221108000605', 'P5220316006009']

export const hiddenMaxAmount = 30

// deprecated
// export const usersCashRegister = ['edwin', 'alexa', 'angel', 'fernanda', 'julian', 'super']

export const userSuper = 'Julian'
export const scannerPaths = ['/products', '/cashRegister']

// export const entornoLocal = process.env.NODE_ENV === 'development'

export const enviroment = import.meta.env.VITE_SITE
localStorage.setItem('enviroment', enviroment)

const monedas = ['MXN', '$', '', '', '', '', '', '', '', '', '']
export const currency = monedas[0]

// Alex localhost 'https://hzmhgzr3-4002.brs.devtunnels.ms/clip/pos/intent/cash'

const storeId = '33'

export const vars =
	enviroment == 'staging' || enviroment == 'localhost'
		? {
				urlAttenpo: 'http://localhost:1340/',
				statusCartDelay: 10000,
				checkingDelay: 2000,
				urlPaymentService: 'payments-staging.nxlabs.io/pos/pinpad',
				urlSaleor: 'https://saleor-staging.nxlabs.io/graphql/',
				saleorToken: import.meta.env.VITE_SALEOR_TOKEN_DEV,
				warehouse: 'V2FyZWhvdXNlOjkwYmEzZjk0LTQxYjktNDBmOC04NTRhLWE4M2EwODRjOWFhYw==',
				state: 'development',
				servPaymentApiCash: 'https://payments-staging.nxlabs.io/pos/pinpad/cash',
				servPaymentApiCard: 'https://payments-staging.nxlabs.io/pos/pinpad/dummy',
				servPaymentVoucher: 'https://payments-staging.nxlabs.io/saleor/discounts/voucher',
				terminalPayment: 'https://payments-staging.nxlabs.io/pos/pinpad/terminal',
				terminals: 'https://payments-staging.nxlabs.io/pos/terminals',
				cashiers: 'https://payments-staging.nxlabs.io/pos/cashiers',
				cardTerminal: 'dummy',
				WhatsApp: '5215644102490',
				manualConfirm: 'https://webhooks-staging.nxlabs.io/core/pos/confirm',
				saleorPickUpMethodID: 'U2hpcHBpbmdNZXRob2Q6MjE=',
				staffValidation: `https://staging.nxlabs.io/store/${storeId}/staff/validations/`,
				validationResponse: `https://staging.nxlabs.io/store/${storeId}/staff/validations/`,
		  }
		: {
				urlAttenpo: 'https://attenpo-pos.nxlabs.io/',
				statusCartDelay: 10000,
				checkingDelay: 2000,
				urlPaymentService: 'https://payments.nxlabs.io/pos/pinpad',
				urlSaleor: 'https://saleor.nxlabs.io/graphql/',
				saleorToken: import.meta.env.VITE_SALEOR_TOKEN,
				warehouse: 'V2FyZWhvdXNlOjdhNGMzNWE4LTUxNjUtNDdjYS1hNmU4LWYzOGI3ZTRmN2JlNA==',
				state: 'production',
				servPaymentApiCash: 'https://payments.nxlabs.io/pos/pinpad/cash',
				servPaymentApiCard: 'https://payments.nxlabs.io/pos/pinpad/card',
				servPaymentVoucher: 'https://payments.nxlabs.io/saleor/discounts/voucher',
				terminalPayment: 'https://payments.nxlabs.io/pos/terminal',
				terminals: 'https://payments.nxlabs.io/pos/terminals/',
				cashiers: 'https://payments.nxlabs.io/pos/cashiers',
				cardTerminal: 'prod-card',
				WhatsApp: '5215541777724',
				manualConfirm: 'https://webhooks.nxlabs.io/core/pos/confirm',
				saleorPickUpMethodID: 'U2hpcHBpbmdNZXRob2Q6MQ==',
				staffValidation: `https://nxlabs.io/store/${storeId}/staff/validations/`,
				validationResponse: 'https://staging.nxlabs.io/store/33/staff/validations/',
		  }

export let texts = {
	codeNotFound: 'El código no fue encontrado,<br>consulte con el encargado',
	voucherInvalid: 'CONTINUAR',
}
