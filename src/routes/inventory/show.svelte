<script>
	import { goto } from '@roxi/routify'
	import { product } from '@/stores/productStore'

	import ShowInventory from '@/components/product/ShowInventory.svelte'

	export let addingErrorMessage = false

	const addingError = () => {
		addingErrorMessage = true
		setTimeout(() => {
			addingErrorMessage = false
		}, 2000)
	}

	const returnToScannerViewer = () => {
		$goto('/inventory')
	}
</script>

<ShowInventory {addingErrorMessage} {returnToScannerViewer} />
