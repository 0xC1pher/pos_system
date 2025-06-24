<script>
	import Message from '@/components/Message.svelte'
	let messageTxt = 'Lista de Compras no encontrada'
	let gotoLink = '/'
	let botonColor = 'button-orange'
</script>

<Message {messageTxt} {gotoLink} {botonColor} />
