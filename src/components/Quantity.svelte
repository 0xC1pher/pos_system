<script>
	import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	export let quantity
	export let stockQty
	export let size = 4

	const addQuantity = () => {
		if (quantity > 0 && !(stockQty <= quantity)) {
			quantity++
		}
	}

	const minusQuantity = () => {
		if (quantity > 1) {
			quantity--
		}
	}
	// $: console.log({ stockQty, quantity }, stockQty < quantity)
</script>

<div class="quantity">
	<button class="button-sign" on:click={minusQuantity} disabled={stockQty == 0}>
		<Fa icon={faMinus} size={`${size}x`} />
	</button>
	<div class="qty-txt">{quantity}</div>
	<button class="button-sign" on:click={addQuantity} disabled={stockQty < quantity}>
		<Fa icon={faPlus} size={`${size}x`} />
	</button>
</div>
