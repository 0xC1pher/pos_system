<script>
	import StatusBar from '@/components/product/StatusBar.svelte'
	import ProgressBar from '@/components/ProgressBar.svelte'
</script>

<ProgressBar />

<div class="container">
	<StatusBar />
	<slot />
</div>
