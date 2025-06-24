<script>
	import ProgressBar from '@/components/ProgressBar.svelte'
	import StatusBar from '@/components/StatusBar.svelte'
</script>

<ProgressBar />

<div class="container">
	<!-- <MarqeeBar /> -->
	<StatusBar logoLink="/cashRegister/scanterminal" />
	<slot />
</div>
