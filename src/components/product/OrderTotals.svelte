<script>
	import { currency } from '@/tools/variables'
	import { totalCheckoutValues } from '@/stores/productStore'
	import { formatNumber2DecDot } from '@/tools/functions'

	export let total
</script>

{#if total != 0}
	<div class="checkout-values">
		<div class="checkout-totals">
			<div class="checkout-total">Total a pagar:</div>
			<div class="checkout-value">
				<div class="currency">
					{currency}
				</div>
				<div class="amount">
					{formatNumber2DecDot(parseFloat(total))}
				</div>
			</div>
		</div>
	</div>
{/if}
