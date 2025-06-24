<script>
  import StatusBarBack from '@/components/product/StatusBarBack.svelte'
  import ProgressBar from '@/components/ProgressBar.svelte'
</script>

<ProgressBar />

<div class="container">
  <StatusBarBack />
  <slot />
</div>
