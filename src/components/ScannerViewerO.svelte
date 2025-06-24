<script>
	import { onMount, onDestroy } from 'svelte'
	import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
	import { Fa } from 'svelte-fa'
	import { faCameraRotate } from '@fortawesome/free-solid-svg-icons'
	import { useFrontalCamera } from '@/stores/generalStore'
	import { getRole, checkAndRequestCameraPermission, isIPhone } from '@/tools/functions'

	const userRole = getRole()

	let scannerRef
	let html5QrCode
	let scanning = false
	let cameraId = null
	let cameras = []
	export let qrResult = ''

	let consecutiveFailures = 0
	let lastErrorMessage = ''
	let userMessage = ''
	let isComponentMounted = false

	// check if the user is using Chrome on iOS
	/* 
	if (navigator.userAgent.indexOf('CriOS') !== -1) {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				// Cámara activada correctamente
			})
			.catch((err) => {
				console.error('Error al acceder a la cámara:', err)
				// Lógica para solicitar el permiso nuevamente o mostrar mensaje al usuario
			})
	}
	 */

	async function handleCameraAccess() {
		if (isIPhone()) {
			const hasPermission = await checkAndRequestCameraPermission()
			if (hasPermission) {
				// Procede a usar la cámara
				return
			} else {
				// Informa al usuario que necesitas acceso a la cámara
				console.log('NO CAMERA ACCESS')
			}
		} else {
			// Comportamiento normal para otros dispositivos
			console.log('NO ES iPhone')
		}
	}
	handleCameraAccess()

	onMount(async () => {
		isComponentMounted = true
		html5QrCode = new Html5Qrcode('reader')
		try {
			cameras = await Html5Qrcode.getCameras()
			if (cameras && cameras.length) {
				cameraId = cameras[0].id
			}
		} catch (err) {
			console.error('Error al obtener cámaras:', err)
			userMessage = 'Error accessing cameras. Please check permissions.'
		}
		if (isComponentMounted) {
			startScanner()
		}
	})

	onDestroy(() => {
		isComponentMounted = false
		// console.log('onDestroy', { html5QrCode })
		if (html5QrCode.isScanning != false) {
			html5QrCode.stop().catch((error) => {
				if (error.toString().includes('Scanner is not in scanning state')) {
					console.log('Scanner was already stopped or never started.')
				} else {
					console.error('Error stopping scanner:', error)
				}
			})
		}
	})

	function onScanSuccess(decodedText, decodedResult) {
		if (!isComponentMounted) return
		qrResult = decodedText
		consecutiveFailures = 0
		userMessage = 'Code scanned successfully!'
	}

	function onScanFailure(error) {
		if (!isComponentMounted) return
		console.log('Scanner Viewer Error: ', error)
		lastErrorMessage = error
		consecutiveFailures++

		if (consecutiveFailures > 50) {
			userMessage = 'Having trouble scanning? Try adjusting the camera or the code position.'
		}
	}

	async function startScanner() {
		if (!isComponentMounted) return
		if (html5QrCode && !scanning && cameraId) {
			try {
				await html5QrCode.start(
					{ facingMode: $useFrontalCamera ? 'user' : 'environment' },
					{
						fps: 10,
						qrbox: { width: 250, height: 250 },
						supportedFormats: [
							Html5QrcodeSupportedFormats.QR_CODE,
							Html5QrcodeSupportedFormats.EAN_13,
							Html5QrcodeSupportedFormats.CODE_128,
							Html5QrcodeSupportedFormats.DATA_MATRIX,
						],
					},
					onScanSuccess,
					onScanFailure,
				)
				scanning = true
				userMessage = 'Scanner started. Position a code in the frame.'
			} catch (err) {
				console.error(`Error al iniciar el escáner: ${err}`)
				userMessage = 'Error starting the scanner. Please refresh and try again.'
			}
		}
	}

	async function stopScanner() {
		if (!isComponentMounted) return
		if (html5QrCode && scanning) {
			console.log('stopScanner')
			try {
				await html5QrCode.stop()
				scanning = false
				userMessage = 'Scanner stopped.'
			} catch (err) {
				console.error(`Error al detener el escáner: ${err}`)
				userMessage = 'Error stopping the scanner.'
			}
		}
	}

	async function switchCamera() {
		if (!isComponentMounted) return
		if (scanning) {
			await stopScanner()
		}
		$useFrontalCamera = !$useFrontalCamera
		if (!scanning) {
			await startScanner()
		}
		userMessage = `Switched to ${$useFrontalCamera ? 'front' : 'rear'} camera.`
	}
</script>

<div>
	<div class="change-camera">
		<div></div>
		<button on:click={switchCamera} title="Toggle camera" disabled={cameras.length <= 1}>
			<Fa icon={faCameraRotate} size="1.6x" />
		</button>
	</div>

	<div class="scanner-viewer">
		<div class="corner top-left"></div>
		<div class="corner top-right"></div>
		<div class="corner bottom-left"></div>
		<div class="corner bottom-right"></div>
		<div id="reader" bind:this={scannerRef}></div>
	</div>

	<!-- Debug area, only userRole == 'Super' -->
	{#if userRole == 'Super'}
		<div class="debug-info">
			<p>User Message: {userMessage}</p>
			<p>Consecutive Failures: {consecutiveFailures}</p>
			<p>Last Error: {lastErrorMessage}</p>
		</div>
	{/if}
</div>

<style>
	#reader video {
		playsinline: true;
	}
	.debug-info {
		margin-top: 20px;
		padding: 10px;
		background-color: #f0f0f0;
		border-radius: 5px;
	}
</style>
