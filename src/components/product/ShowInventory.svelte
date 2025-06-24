<script lang="ts">
	import { onMount } from 'svelte'

	import Fa from 'svelte-fa'
	import { faCheck, faEarListen, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons'
	import { RingLoader } from 'svelte-loading-spinners'
	import { getStorageJson } from '@/tools/functions'
	import { product } from '@/stores/productStore'
	import { currency } from '@/tools/variables'

	export let addingErrorMessage
	export let returnToScannerViewer
	const productFound = getStorageJson('product-found-inv') || null
	let newQty = ''
	let quantity = 0
	let recognition
	let isListening = false

	let inputElement
	let inputValue = 'Texto pre-rellenado'
	let inputRef

	const focusRef = () => {
		inputRef.focus()
	}

	function handleFocus(event) {
		event.target.select()
	}

	const prod = {
		image: productFound.media[0]?.url !== undefined ? productFound.media[0].url : '',
		name: productFound.name,
		quantity: productFound.stocks[0].quantity,
		sku: productFound.product.variants[0].sku,
		price: productFound.channelListings[0].price.amount,
		cost: productFound.channelListings[0].costPrice.amount,
	}
	console.log({ productFound, prod })
	let stockQty = prod.quantity

	onMount(() => {
		inputRef.focus()
		/**
		 * @type {typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition}
		 */
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
		if (SpeechRecognition) {
			recognition = new SpeechRecognition()
			recognition.continuous = false
			recognition.interimResults = false
			recognition.lang = 'es-ES'

			recognition.onresult = async (event) => {
				newQty = ''
				console.log('¡Te escuché!')
				const transcript = event.results[0][0].transcript
				console.log('Transcripción:', transcript)
				newQty = isNaN(transcript) ? '' : transcript
				// newQty = transcript
				focusRef()
				console.log({ newQty })
			}

			recognition.onerror = (event) => {
				console.error('Error en el reconocimiento de voz:', event.error)
				isListening = false
			}

			recognition.onend = () => {
				isListening = false
			}
		} else {
			console.error('El reconocimiento de voz no está soportado en este navegador.')
		}
	})

	function startListening() {
		if (recognition && !isListening) {
			recognition.start()
			isListening = true
		}
	}

	let updating = false
	const updateQuantity = async () => {
		console.log({ newQty })
		if (newQty) {
			updating = true
			console.log('updating')
			try {
				const response = await product.updateProductVariantStock(prod.sku, newQty)
				console.log('updateQuantity', response)
				updating = false
				stockQty = newQty
			} catch (error) {
				console.error('Error updateQuantity:', error)
				addingError()
				throw error
			}
		}
	}

	let earColor = 'coral'

	const addingError = () => {
		addingErrorMessage = true
		setTimeout(() => {
			addingErrorMessage = false
		}, 2000)
	}
</script>

<!-- <ReturnMarquee /> -->
<div class="inventory-container">
	<div class="inventory-title">Actualizar stock</div>
	<div class="inventory-description">
		<div class="inventory-imagen">
			{#if prod.image !== ''}
				<img src={prod.image} alt={prod.name} />
			{/if}
		</div>
		<div class="inventory-data">
			<div class="inventory-name">{prod.name}</div>
			<div class="inventory-cost">
				<span>Costo:</span>
				<div>{currency} {prod.cost}</div>
			</div>
			<div class="inventory-cost">
				<span>Precio:</span>
				<div>{currency} {prod.price}</div>
			</div>
		</div>
	</div>

	<div class="quantity-container">
		<div class="quantity-data">
			<div><span>Stock registrado:</span> {stockQty}</div>
			<div>
				<span>Conteo:</span>
				<label for="">
					<input type="text" bind:value={newQty} bind:this={inputRef} on:focus={handleFocus} />
				</label>
			</div>
		</div>
		<div class="quantity-actions">
			{#if updating}
				<div class="quantity-loader">
					<RingLoader />
				</div>
			{:else}
				<div class="quantity-speak">
					<button class="speak" on:click={startListening} disabled={isListening}>
						<Fa icon={faEarListen} size="5x" color={earColor} />
					</button>
					<span>
						{@html isListening ? 'Escuchando...' : '&nbsp;'}
					</span>
				</div>
			{/if}
		</div>
	</div>
	<div class="inventory-buttons">
		<button class="button-return" on:click={returnToScannerViewer}>
			<Fa icon={faTimes} size="3x" color="white" />
		</button>
		<button class="button-action" on:click={updateQuantity}>
			<Fa icon={faCheck} size="3x" color="white" />
		</button>
	</div>
	{#if addingErrorMessage}
		<div class="inventory-stock-error">
			<Fa icon={faWarning} size="3x" color="red" />
			<div>
				<span>Error al acceder al producto</span>
				<span class="sorry"></span>
			</div>
		</div>
	{/if}
</div>
