<script>
	import { onMount } from 'svelte'
	import { goto } from '@roxi/routify'
	import { faArrowRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import { checkoutLines, checkoutTotal, product } from '@/stores/productStore'
	import { currency } from '@/tools/variables'

	export let linesDetail

	// console.log('ProductItemViewTxt', linesDetail)

	// const quantity = linesDetail.quantity
	// const productName = linesDetail.variant.name
	// const productPrice = linesDetail.totalPrice.gross.amount
	// const image = linesDetail.variant.media[0]?.url
	// const imageAlt = linesDetail.variant.media[0]?.alt
</script>

<div class="product-list-container-txt">
	<div class="product-items">
		{#each linesDetail as prod, key}
			<div class="product-item">
				<div class="product-image">
					<img src={prod.variant.media[0]?.url} alt={prod.variant.media[0]?.alt} />
				</div>
				<div class="product-name">{prod.variant.name}</div>
				<div class="product-quantity">{prod.quantity}</div>
				<div class="product-price">
					<div class="product-price-currency">
						{currency}
					</div>
					<div class="product-price-amount">
						{prod.totalPrice.gross.amount}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
