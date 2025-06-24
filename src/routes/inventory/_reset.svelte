<script>
	import StatusBarBack from '@/components/product/StatusBarBack.svelte'
	import StatusBarInventory from '@/components/product/StatusBarInventory.svelte'
	import ProgressBar from '@/components/ProgressBar.svelte'
</script>

<ProgressBar />

<div class="container">
	<!-- <StatusBarInventory backLink="/inventory" /> -->
	<StatusBarInventory />
	<slot />
</div>
