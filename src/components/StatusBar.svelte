<script>
	import { url } from '@roxi/routify'
	import { goto } from '@roxi/routify'
	import { Fa } from 'svelte-fa'
	import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
	import { backLink, NoBackButton } from '@/stores/generalStore'
	console.log('backLink', $backLink)
	export let logoLink = '.'

	const goBack = () => {
		if ($backLink != '.') {
			$goto($backLink)
		}
	}
</script>

<div class="status-bar-container">
	<div class="status-logo">
		<a href={$url(logoLink)}>
			<img src="/images/attenpo-shop.svg" alt="" />
		</a>
	</div>
	<div></div>
	<div class="status-cart-container">
		{#if $NoBackButton}
			<button class="status-cart" on:click={goBack}>
				<Fa icon={faArrowLeftLong} />
				Volver
			</button>
		{/if}
	</div>
</div>
