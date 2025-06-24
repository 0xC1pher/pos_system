<script>
  import MarqeeBar from '@/components/MarqeeBar.svelte'
  import ProgressBar from '@/components/ProgressBar.svelte'
</script>

<ProgressBar />

<div class="container">
  <MarqeeBar />
  <slot />
</div>
