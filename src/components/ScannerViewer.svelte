<script>
	import { onMount, onDestroy } from 'svelte'
	import jsQR from 'jsqr'
	import { goto } from '@roxi/routify'
	import { Fa } from 'svelte-fa'
	import { faCameraRotate } from '@fortawesome/free-solid-svg-icons'

	export let qrResult

	let videoElement
	let canvasElement
	let canvasContext
	let stream
	let useFrontCamera = false // Estado para alternar entre cámaras

	onMount(() => {
		startCamera()
	})

	onDestroy(() => {
		stopCamera()
	})

	async function startCamera() {
		stopCamera()

		try {
			const constraints = {
				video: {
					facingMode: useFrontCamera ? 'user' : 'environment', // Alterna entre frontal y trasera
				},
			}

			stream = await navigator.mediaDevices.getUserMedia(constraints)
			videoElement.srcObject = stream
			videoElement.play()

			canvasElement = document.createElement('canvas')
			canvasContext = canvasElement.getContext('2d', { willReadFrequently: true })

			requestAnimationFrame(scanQRCode)
		} catch (error) {
			console.error('Error accessing the camera: ', error)
		}
	}

	export function stopCamera() {
		console.log('stopping camera')
		if (stream) {
			const tracks = stream.getTracks()
			tracks.forEach((track) => track.stop())
			stream = null
		}
		if (videoElement) {
			videoElement.srcObject = null
		}
		console.log('camera stopped')
	}

	function toggleCamera() {
		useFrontCamera = !useFrontCamera
		startCamera()
	}

	const scanQRCode = () => {
		if (videoElement && videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
			canvasElement.width = videoElement.videoWidth
			canvasElement.height = videoElement.videoHeight
			canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
			const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height)
			const code = jsQR(imageData.data, imageData.width, imageData.height)

			if (code) {
				qrResult = code.data
				console.log({ qrResult })
				// bringProduct(qrResult)
				return
			}
		}

		requestAnimationFrame(scanQRCode)
	}
</script>

<div class="change-camera">
	<div></div>
	<button on:click={toggleCamera} title="Toggle camera">
		<Fa icon={faCameraRotate} size="1.6x" />
	</button>
</div>

<div class="scanner-viewer">
	<div class="corner top-left"></div>
	<div class="corner top-right"></div>
	<div class="corner bottom-left"></div>
	<div class="corner bottom-right"></div>
	<!-- <img src="/images/qr-producto.jpg" alt="Customer QR ID" /> -->
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={videoElement} autoplay playsinline></video>
</div>
