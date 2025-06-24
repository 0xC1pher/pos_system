<script>
	import { goto } from '@roxi/routify'
</script>

<div class="user-denied">
	<button class="button button-orange" on:click={() => $goto('/cashRegister/scanterminal')}
		>EL QR CONTIENE UNA ORDEN</button
	>
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
