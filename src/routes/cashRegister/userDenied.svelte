<script>
	import { goto } from '@roxi/routify'
</script>

<div class="user-denied">
	<button class="button button-red" on:click={() => $goto('/')}>USUARIO NO AUTORIZADO</button>
</div>

<style>
	.user-denied {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.user-denied button {
		font-size: 1.3rem;
	}
</style>
