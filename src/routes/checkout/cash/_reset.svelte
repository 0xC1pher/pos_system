<script>
	// import StatusBar from '@/components/StatusBar.svelte'
	import ProgressBar from '@/components/ProgressBar.svelte'
	import StatusBarBack from '@/components/product/StatusBarBack.svelte'
</script>

<ProgressBar />

<div class="container">
	<!-- <StatusBar logoLink="." /> -->
	<StatusBarBack />
	<slot />
</div>
