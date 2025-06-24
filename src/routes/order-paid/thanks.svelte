<script>
	import { goto } from '@roxi/routify'

	setTimeout(() => {
		$goto('/', { mode: 'replace' })
	}, 5000)
</script>

<div class="thanks-container">
	<div class="section-name">Su compra está completa</div>
	<!-- <div class="button button-white space-down">Ver el resúmen de su compra</div> -->
	<div class="logo-nxlabs">
		<img src="/images/attenpo.jpg" alt="atenpo by NXLabas.io" />
	</div>
	<div class="thanks-message space-down">Muchas gracias por habernos elegido</div>
</div>
