<script>
	import Fa from 'svelte-fa'

	export let quantity
	export let stockQty

	console.log({ stockQty })

	const addQuantity = () => {
		if (quantity > 0) {
			quantity++
		}
	}

	const minusQuantity = () => {
		if (quantity > 1) {
			quantity--
		}
	}

	const quantitys = [1, 2, 3, 4, 5]

	const changeQty = (n) => {
		quantity = n
	}
</script>

<div class="quantity-buttons">
	{#each quantitys as qty}
		<button
			class="button-qty"
			class:disabled={stockQty < qty}
			class:equal={quantity == qty}
			on:click={() => changeQty(qty)}
			disabled={stockQty < qty}
		>
			{qty}
		</button>
	{/each}
</div>
