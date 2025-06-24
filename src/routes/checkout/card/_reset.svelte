<script>
	import ProgressBar from '@/components/ProgressBar.svelte'
	import StatusBarBackLink from '@/components/product/StatusBarBackLink.svelte'
</script>

<ProgressBar />

<div class="container">
	<StatusBarBackLink />
	<!-- <MarqeeBar /> -->
	<slot />
</div>
