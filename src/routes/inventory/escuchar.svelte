<script lang="ts">
	import { onMount } from 'svelte'

	let quantity = 0
	let recognition
	let isListening = false

	onMount(() => {
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
				const transcript = event.results[0][0].transcript
				console.log('Transcripción:', transcript)
				quantity = transcript
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
</script>

<main>
	<h1>Indicador de Cantidad por Voz</h1>
	<p>Cantidad actual: {quantity}</p>
	<button on:click={startListening} disabled={isListening}>
		{isListening ? 'Escuchando...' : 'Hablar'}
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 20px;
		font-family: Arial, sans-serif;
	}

	button {
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
	}
</style>
