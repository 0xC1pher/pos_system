<script>
	import { currency } from '@/tools/variables'
	import { totalCheckoutValues } from '@/stores/productStore'
	import { formatNumber2DecDot } from '@/tools/functions'

	$: total = $totalCheckoutValues.totalPayment
	// console.log('Checkout', $totalCheckoutValues.totalPayment)
	// console.log('total', total)
	export let totalOnly = false
</script>

{#if total != 0}
	<div class="checkout-values">
		{#if $totalCheckoutValues.discount > 0 && !totalOnly}
			<div class="checkout-totals">
				<div class="checkout-total">SubTotal:</div>
				<div class="checkout-value">
					<div class="currency">
						{currency}
					</div>
					<div class="amount">
						{formatNumber2DecDot($totalCheckoutValues.totalCheckout)}
					</div>
				</div>
			</div>
			<div class="checkout-totals">
				<div class="checkout-total">Descuento:</div>
				<div class="checkout-value">
					<div class="currency">
						{currency}
					</div>
					<div class="amount">
						{formatNumber2DecDot($totalCheckoutValues.discount)}
					</div>
				</div>
			</div>
		{/if}
		<div class="checkout-totals">
			<div class="checkout-total">Total a pagar:</div>
			<div class="checkout-value">
				<div class="currency">
					{currency}
				</div>
				<div class="amount">
					{formatNumber2DecDot($totalCheckoutValues.totalPayment)}
				</div>
			</div>
		</div>
	</div>
{/if}
