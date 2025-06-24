<script>
	import { onMount } from 'svelte'
	import { Router, createRouter } from '@roxi/routify'

	let routes
	onMount(async () => {
		routes = await import('../.routify/routes.default.js')
	})

	import GlobalScssImports from './GlobalScssImports.svelte'
</script>

<GlobalScssImports />
<Router {routes} />
