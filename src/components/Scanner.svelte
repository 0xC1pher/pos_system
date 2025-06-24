<script>
  import { onMount } from 'svelte'
  import jsQR from 'jsqr'
  import { fetchProductVariant } from '@/tools/graphql'

  let videoElement
  let canvasElement
  let canvasContext
  let qrResult = ''
  let productData = null
  let stream

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoElement.srcObject = stream
      videoElement.play()

      canvasElement = document.createElement('canvas')
      canvasContext = canvasElement.getContext('2d')

      requestAnimationFrame(scanQRCode)
    } catch (error) {
      console.error('Error accessing the camera: ', error)
    }
  })

  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  async function scanQRCode() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      canvasElement.width = videoElement.videoWidth
      canvasElement.height = videoElement.videoHeight
      canvasContext.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height)
      const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        qrResult = code.data
        console.log('QR Code detected: ', qrResult)
        stopCamera()
        try {
          productData = await fetchProductVariant(qrResult)
          console.log('Product data: ', productData)
        } catch (error) {
          console.error('Error fetching product data:', error)
        }
        return // Detenemos la ejecución de scanQRCode al encontrar un QR
      }
    }

    requestAnimationFrame(scanQRCode)
  }
</script>

<video bind:this={videoElement} autoplay playsinline></video>
{#if productData}
  <div>
    <h1>{productData.name}</h1>
    <img src={productData.media[0].url} alt={productData.media[0].alt} />
    <p>
      Price: {productData.channelListings[0].price.amount}
      {productData.channelListings[0].price.currency}
    </p>
  </div>
{:else}
  <p>Loading...</p>
{/if}

<style>
  video {
    width: 100%;
    height: auto;
  }

  img {
    width: 100px;
    height: auto;
  }

  p {
    font-size: 1.2em;
    margin-top: 10px;
  }
</style>
