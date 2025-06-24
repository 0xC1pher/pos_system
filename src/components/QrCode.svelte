<script>
	import { onMount } from 'svelte'
	import QRCode from 'qrcode'

	export let textToQR
	let qrCodeUrl = ''

	// Function to generate QR code
	async function generateQRCode(text) {
		try {
			// console.log(text)
			qrCodeUrl = text && (await QRCode.toDataURL(text))
		} catch (err) {
			console.error(err)
		}
	}

	// Generate QR code on component mount
	onMount(() => {
		generateQRCode(textToQR)
	})
	$: generateQRCode(textToQR)

	// Update QR code when the text changes
</script>

<div class="qr-code-container">
	<!-- <input type="text" bind:value={textToQR} placeholder="Enter text" /> -->
	<!-- <button on:click={() => (textToQR = '')}>Clear</button> -->
	<div class="qr-code-image">
		{#if qrCodeUrl}
			<img src={qrCodeUrl} alt="QR Code" />
		{/if}
	</div>
</div>
