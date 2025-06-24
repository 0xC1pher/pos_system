<script>
	// import { Jumper } from 'svelte-loading-spinners'
	import { goto, url } from '@roxi/routify'
	import { checkoutLines, checkoutTotal, checkoutListId } from '@/stores/productStore'
	import { fetchCheckout } from '@/tools/graphql'
	import { Fa } from 'svelte-fa'
	import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
	import { getStorage } from '@/tools/functions'

	// export let backLink = '/cashRegister'
</script>

<div class="status-bar-container">
	<div class="status-logo">
		<a href={$url('/cashRegister')}>
			<img src="/images/attenpo.png" alt="Attenpo" />
		</a>
	</div>
	<div></div>
	<div class="status-cart-container">
		<!-- 
		<button class="status-cart" on:click={() => $goto(backLink)}>
			<Fa icon={faArrowLeftLong} />
			Volver
		</button> -->
	</div>
</div>
