<script>
	// import { Jumper } from 'svelte-loading-spinners'
	import { goto } from '@roxi/routify'
	import { Fa } from 'svelte-fa'
	import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
	import { backLink } from '@/stores/generalStore'
	console.log('backLink', $backLink)

	const goBack = () => {
		$goto($backLink)
	}
</script>

<div class="status-bar-container">
	<div class="status-logo">
		<img src="/images/attenpo-shop.svg" alt="" />
	</div>
	<div></div>
	<div class="status-cart-container">
		{#if $backLink != ''}
			<button class="status-cart" on:click={goBack}>
				<Fa icon={faArrowLeftLong} />
				Volver
			</button>
		{/if}
	</div>
</div>
