<script>
	import { goto } from '@roxi/routify'
	import Fa from 'svelte-fa'
	import { faWarning } from '@fortawesome/free-solid-svg-icons'
	export let errorMessage, errorCode, returnLink
</script>

<div class="error-message">
	<Fa icon={faWarning} size="3x" color="red" />
	<div>
		<span>Se produjo un error</span>
		<span class="error-code">{errorCode}: {errorMessage}</span><br />
		<button
			class="button-return"
			on:click={() => {
				$goto(returnLink)
			}}
		></button>
	</div>
</div>
