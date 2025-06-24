<script>
	export let closeButtonAlert, text, secondaryText
</script>

<div class="alert-message-container">
	<button class="message" on:click={closeButtonAlert}>
		{text}
		<div class="secondary-text">{@html secondaryText}</div>
		<div class="close-text">click para salir</div>
	</button>
</div>
