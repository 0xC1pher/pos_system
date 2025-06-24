<script>
	import { goto } from '@roxi/routify'
	import A from '../../../.routify/components/[...404].svelte'
</script>

<div class="user-denied">
	<button class="button button-red" on:click={() => $goto('/cashRegister/scanterminal')}>QR INVÁLIDO</button>
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
