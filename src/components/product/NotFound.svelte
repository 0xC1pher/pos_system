<script>
	import { texts } from '@/tools/variables'
	export let closeButtonNotFound
</script>

<div class="not-found-container">
	<div class="not-found-message">{@html texts.codeNotFound}</div>
	<button class="button button-red not-found" on:click={closeButtonNotFound}>Continuar</button>
</div>
