import { attenpoPhoneNumber, serialPOSClip } from '@/tools/variables'
import { parse } from 'svelte/compiler'

export const getRandomPhoneNumber = () => {
	// Códigos de país de algunos países latinoamericanos
	const countryCodes = {
		Argentina: '+54',
		Bolivia: '+591',
		Brazil: '+55',
		Chile: '+56',
		Colombia: '+57',
		CostaRica: '+506',
		Cuba: '+53',
		DominicanRepublic: '+1-809', // También puede ser +1-829, +1-849
		Ecuador: '+593',
		ElSalvador: '+503',
		Guatemala: '+502',
		Honduras: '+504',
		Mexico: '+52',
		Nicaragua: '+505',
		Panama: '+507',
		Paraguay: '+595',
		Peru: '+51',
		PuertoRico: '+1-787', // También puede ser +1-939
		Uruguay: '+598',
		Venezuela: '+58',
	}

	const flagEmojis = {
		Argentina: '🇦🇷',
		Bolivia: '🇧🇴',
		Brazil: '🇧🇷',
		Chile: '🇨🇱',
		Colombia: '🇨🇴',
		CostaRica: '🇨🇷',
		Cuba: '🇨🇺',
		DominicanRepublic: '🇩🇴',
		Ecuador: '🇪🇨',
		ElSalvador: '🇸🇻',
		Guatemala: '🇬🇹',
		Honduras: '🇭🇳',
		Mexico: '🇲🇽',
		Nicaragua: '🇳🇮',
		Panama: '🇵🇦',
		Paraguay: '🇵🇾',
		Peru: '🇵🇪',
		PuertoRico: '🇵🇷',
		Uruguay: '🇺🇾',
		Venezuela: '🇻🇪',
	}

	// Convertimos los códigos de país en un array
	const countryCodeArray = Object.values(countryCodes)
	const countryNames = Object.keys(countryCodes)
	// Elegimos un código de país al azar
	const country = Math.floor(Math.random() * countryCodeArray.length)
	const randomCountryCode = countryCodeArray[country]

	// Generamos un número telefónico al azar de 8 a 10 dígitos
	const phoneNumberLength = Math.floor(Math.random() * 3) + 8 // 8, 9 o 10 dígitos
	const randomPhoneNumber = Array.from({ length: phoneNumberLength }, () => Math.floor(Math.random() * 10)).join('')

	return [`${randomCountryCode} ${randomPhoneNumber}`, countryNames[country], flagEmojis[country]]
}

export const printCurrentDateTime = () => {
	// Crea un nuevo objeto Date con la fecha y hora actual
	const now = new Date()

	// Obtén los componentes de la fecha y hora
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0') // Los meses son de 0 a 11, por eso sumamos 1
	const day = now.getDate().toString().padStart(2, '0')
	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')
	const seconds = now.getSeconds().toString().padStart(2, '0')

	// Forma la cadena con la fecha y hora en el formato deseado
	const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`

	// Imprime la cadena
	return dateTimeString
}

export function formatNumber2DecDot(num) {
	// return num.toFixed(2).replace('.', ',')
	return num.toFixed(2)
}

export function formatNumber2DecComma(num) {
	return num.toFixed(2).replace('.', ',')
}

// get current date in US format
export function getActualDateUS() {
	const hoy = new Date()
	const año = hoy.getFullYear()
	const mes = (hoy.getMonth() + 1 < 10 ? '0' : '') + (hoy.getMonth() + 1)
	const dia = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate()
	return `${año}-${mes}-${dia}`
}

// get current date in milliseconds
export function getActualDateTS() {
	const hoy = new Date()
	return hoy.getTime()
}

export function convertTimestampToDateEs(timestamp) {
	timestamp = parseInt(timestamp)
	const fecha = new Date(timestamp)
	const mes = (fecha.getMonth() + 1 < 10 ? '0' : '') + (fecha.getMonth() + 1) // Mes en dos dígitos
	const dia = (fecha.getDate() < 10 ? '0' : '') + fecha.getDate() // Día en dos dígitos
	const ano = fecha.getFullYear()
	const horas = (fecha.getHours() < 10 ? '0' : '') + fecha.getHours() // Horas en dos dígitos
	const minutos = (fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes() // Minutos en dos dígitos
	return `${dia}-${mes}-${ano} ${horas}:${minutos}hs`
}

export function convertTimestampToDateEsWorld(timestamp, timeZone = 'America/Mexico_City') {
	timestamp = parseInt(timestamp)
	const fecha = new Date(timestamp)

	// Convertir la fecha al formato especificado con la zona horaria deseada
	const opciones = {
		timeZone: timeZone,
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // Formato de 24 horas
	}

	const fechaEnZona = fecha.toLocaleString('es-ES', opciones)

	// Reemplazar caracteres para tener el formato deseado
	return fechaEnZona.replace(',', '') // Salida: DD-MM-YYYY HH:mm
}

export const extractDigits = (input) => {
	return String(input).replace(/\D/g, '')
}

export const extractDecimal = (num) => {
	return Math.floor(num * 100) / 100
}

export const getStorage = (variable) => {
	return localStorage.getItem(variable)
}

export const getStorageJson = (variable) => {
	const value = localStorage.getItem(variable)
	return value !== null ? JSON.parse(value) : null
}

export const keepInStore = (variable, value) => {
	localStorage.setItem(variable, value)
	return true
}

export const keepInStoreJson = (variable, jsonValue) => {
	console.log({ jsonValue })
	const value = JSON.stringify(jsonValue)
	localStorage.setItem(variable, value)
	return true
}

export const cleanStore = (variable) => {
	localStorage.removeItem(variable)
}

export const cleanLocalStorage = () => {
	const dateTime = printCurrentDateTime()
	localStorage.removeItem('attenpo-order-id')
	localStorage.removeItem('attenpo-order-total')
	localStorage.removeItem('attenpo-order-number')
	localStorage.removeItem('checkoutList')
	localStorage.removeItem('payment-type')
	localStorage.removeItem('userCashRegister')
	localStorage.removeItem('clientName')
	localStorage.removeItem('phoneNumber')
	localStorage.removeItem('product-found')
	localStorage.removeItem('product-found-inv')
	localStorage.removeItem('voucher-applied')
	localStorage.removeItem('customerId')
	localStorage.removeItem('saleorPhoneNumber')
	localStorage.removeItem('order-payment')
	localStorage.removeItem('userCashRegister')
}

export const isCashRegister = (name) => {
	// console.log('isCashRegister', { usersCashRegister })
	// const exists = usersCashRegister.includes(name.toLowerCase())
	// console.log('isCashRegister', { exists })
	const exists = localStorage.getItem('userCashRegister')
	return exists
}

export const getRole = () => {
	let role = 'client'
	const phoneNumber = localStorage.getItem('phoneNumber')

	const clientAttenpoTot = localStorage.getItem('clientName')
	const clientAttenpo = typeof clientAttenpoTot === 'string' ? localStorage.getItem('clientName').split('_')[0] : ''

	const clientNameTot = localStorage.getItem('clientName')
	const clientName = typeof clientNameTot === 'string' ? localStorage.getItem('clientName').split('_')[1] : ''

	const cashier = localStorage.getItem('userCashRegister')
	if (cashier) {
		role = 'admin'
	}

	// if (isCashRegister(clientName) && clientAttenpo == 'attenpo') {
	// 	// if (phoneNumber == `attenpo_${clientName}`) {
	// 	role = 'admin'
	// 	// } else if (phoneNumber == 'nxsuperadmin') {
	// 	// role = 'super'
	// 	// }
	// }

	console.log('Role:', role)
	return role
}

// if edit checkout is active, the user can edit the checkout
export const editMode = () => {
	const editCheckout = localStorage.getItem('edit-checkout')
	return editCheckout === '1'
}

export async function checkAndRequestCameraPermission() {
	try {
		const result = await navigator.permissions.query({ name: 'camera' })
		if (result.state === 'granted') {
			// El permiso ya está concedido
			return true
		} else if (result.state === 'prompt') {
			// Solicitar permiso
			await navigator.mediaDevices.getUserMedia({ video: true })
			return true
		} else {
			// Permiso denegado
			console.log('Permiso de cámara denegado')
			return false
		}
	} catch (error) {
		console.error('Error al verificar el permiso de la cámara:', error)
		return false
	}
}

export function isIPhone() {
	// return /iPhone/i.test(navigator.userAgent)
	return navigator.userAgent.indexOf('CriOS') !== -1
}

export async function logErrorToFile(error) {
	try {
		const response = await fetch('/log-error', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ error }),
		})
		if (!response.ok) {
			console.error('Failed to log error:', response.statusText)
		}
	} catch (loggingError) {
		console.error('Error logging the error:', loggingError)
	}
}

export function formatoNumeroWhatsApp(numero) {
	const numeroLimpio = numero.replace(/[\s\-()]/g, '')
	const esSoloDigitos = /^\d+$/.test(numeroLimpio)
	if (esSoloDigitos && numeroLimpio.length >= 10 && numeroLimpio.length <= 15) {
		return numeroLimpio
	} else {
		return false
	}
}

export function formatDateUStoES(fecha) {
	const datos = fecha.split('-')
	const date = datos[2] + '/' + datos[1] + '/' + datos[0]
	return date
}
