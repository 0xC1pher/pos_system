<script>
	import { terminals } from '@/stores/terminalStore'
	import Fa from 'svelte-fa'
	import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
	import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'

	let terminalList = []
	let newSerial = ''
	let newName = ''
	let buttonUpdateDisabled = true
	let message = ''

	const showMessage = (text) => {
		message = text
		setTimeout(() => {
			message = ''
		}, 2000)
	}

	const getTerminals = async () => {
		try {
			const response = await terminals.getTerminals()
			console.log('terminals', { response })
			terminalList = response.body.map((terminal) => {
				let user = false
				let cashier = false
				if (terminal.mode == 'cashier') {
					cashier = true
				} else if (terminal.mode == 'user') {
					user = true
				} else if (terminal.mode == 'both') {
					cashier = true
					user = true
				} else {
					cashier = false
					user = false
				}
				return {
					id: terminal.id,
					serial: terminal.serial,
					user,
					cashier,
					active: terminal.active,
					name: terminal.name,
				}
			})
			buttonUpdateDisabled = true
		} catch (error) {
			console.error('getTerminals', { error })
		}
	}

	const addTerminal = async () => {
		if (newSerial != '') {
			const response = await terminals.addTerminal(newSerial, 'both', newName)
			await getTerminals()
			showMessage('Terminal agregado')
		}
	}

	const delTerminal = async (id) => {
		if (confirm('¿Estás seguro de que quieres borrar este terminal?')) {
			const response = await terminals.delTerminal(id)
			await getTerminals()
			showMessage('Terminal eliminada')
			return
		}
		showMessage('No se pudo borrar el terminal')
	}

	const updateTerminals = async () => {
		buttonUpdateDisabled = true
		for (const terminal of terminalList) {
			await terminals.updateTerminal(terminal)
		}
		await getTerminals()
		showMessage('Terminales actualizadas')
	}

	const activeButtonDisabled = () => {
		buttonUpdateDisabled = false
	}

	getTerminals()
</script>

<div class="terminals-container">
	<div class="section-name">Terminales de pago</div>
	<div class="terminals">
		{#each terminalList as terminal (terminal.id)}
			<div class="terminal">
				<div class="terminal-main">
					<div class="terminal-name">
						<span>
							<Fa icon={faCreditCard} size=".8x" />
						</span>
						<span>{terminal.name}</span>
					</div>
					<div class="teminal-serial">
						<span>Serial: {terminal.serial}</span>
					</div>
					<div class="terminal-states">
						<div class="terminal-active">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="mode activo key-switch-wrapper"
								class:active={terminal.active}
								on:click={() => {
									terminal.active = !terminal.active
									activeButtonDisabled()
								}}
							>
								<div class="key-switch" class:active={terminal.active}></div>
							</div>
						</div>
						<button class="trash" on:click={() => delTerminal(terminal.id)}>
							<Fa icon={faTrashAlt} size="1.3x" />
						</button>
					</div>
				</div>
				<div class="terminal-options">
					<div class="mode cashier">
						<span class:bold={terminal.cashier}> Cashier </span>
						<input type="checkbox" bind:checked={terminal.cashier} on:change={activeButtonDisabled} />
					</div>
					<div class="mode user">
						<span class:bold={terminal.user}> User </span>
						<input type="checkbox" bind:checked={terminal.user} on:change={activeButtonDisabled} />
					</div>
					<div class="terminal-desabled" class:hide={terminal.active}></div>
				</div>
			</div>
		{/each}
		<div class="button-update">
			<button class="button button-green actualizar" on:click={updateTerminals} disabled={buttonUpdateDisabled}>
				Actualizar
			</button>
			<div class="message">{message}</div>
		</div>

		<hr class="bar" />

		<div class="terminal-add">
			<div class="terminal-inputs">
				<input type="text" placeholder="# serie" bind:value={newSerial} title="Nuevo terminal: #serie" />

				<input type="text" placeholder="Nombre" bind:value={newName} title="Nuevo terminal: nombre" />
			</div>
			<div class="terminal-button-add">
				<button class="agregar" on:click={addTerminal} disabled={newSerial === '' && newName === ''}> Agregar </button>
			</div>
		</div>
	</div>
</div>
