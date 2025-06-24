<script>
	import { goto } from '@roxi/routify'

	export let messageTxt
	export let gotoLink
	export let botonColor = 'button-orange'
</script>

<div class="user-denied">
	<button class={`button ${botonColor}`} on:click={() => $goto(gotoLink)}>{messageTxt}</button>
</div>

<style>
	.user-denied {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 50px;
	}
	.user-denied button {
		font-size: 1.3rem;
	}
</style>
