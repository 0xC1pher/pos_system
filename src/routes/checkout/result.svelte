<script>
  import { goto } from '@roxi/routify'
</script>

<div class="payResult-container">
  <div class="seccion-payresult">Pago realizado</div>
  <div class="titles">Desea recibir su factura</div>
  <div class="payresult-buttons">
    <button class="payresult-invoice button button-green" on:click={() => $goto('/products/checkout/final')}>
      Sí
    </button>
    <button class="payresult-invoice button button-white" on:click={() => $goto('/products/checkout/final')}>
      No
    </button>
  </div>
</div>
