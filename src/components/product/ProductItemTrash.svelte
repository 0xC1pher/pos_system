<script>
	import Fa from 'svelte-fa'
	import { faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons'
	import { goto } from '@roxi/routify'

	export let productName
	export let eraseProduct
	export let sendTrash
	export let erasing
</script>

<div class="product-trash">
	<div class="product-buttons-container">
		<div class="product-trash-message">
			<div class="trash-message">¿Eliminamos este producto?</div>
			<div class="trash-prod-name">{productName}</div>
		</div>
		<div class="product-buttons">
			<button class="button-action" on:click={eraseProduct}>
				{#if erasing}
					<Fa icon={faSpinner} size="2x" color="white" spin />
				{:else}
					<Fa icon={faTrash} size="2x" color="white" />
				{/if}
			</button>
			<button class="button-return" on:click={() => (sendTrash = false)}>
				<!-- <Fa icon={faArrowRotateLeft} size="2x" color="white" /> -->
				CANCELAR
			</button>
		</div>
	</div>
</div>
