<script>
	import { onMount, onDestroy } from 'svelte'
	import { cashier } from '@/stores/cashierStore'
	import { userSuper } from '@/tools/variables'
	import { convertTimestampToDateEs, convertTimestampToDateEsWorld } from '@/tools/functions'
	import Fa from 'svelte-fa'
	import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
	import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'

	let cashierList = []
	let message = ''
	let firstName = ''
	let lastName = ''
	let buttonUpdateDisabled = true
	let interval

	onMount(() => {
		getCashiers()
	})

	onDestroy(() => {
		clearInterval(interval)
	})

	interval = setInterval(() => {
		getCashiers()
	}, 10000)

	const getCashiers = async () => {
		try {
			const response = await cashier.getCashiers()
			cashierList = response.body
			console.log('getCashiers response', cashierList)
			cashierList = cashierList.map((cashier) => {
				const last = cashier.privateMetadata.find((privateMD) => privateMD.key == 'last_in')
				const last_in = last.value
				const lastIn = convertTimestampToDateEsWorld(last_in)
				return {
					...cashier,
					lastIn: lastIn,
					last_in: last_in,
				}
			})
			// buttonUpdateDisabled = true
		} catch (error) {
			console.error('getCashiers', { error })
		}
	}

	$: console.log('cashierList', cashierList)

	const getCashier = async (cashierId) => {
		try {
			const response = await cashier.getCashier(cashierId)
			const user = response.body
			console.log('getCashiers response', user)
			// 		// buttonUpdateDisabled = true
		} catch (error) {
			// 		console.error('getCashiers', { error })
		}
	}
	// getCashier('VXNlcjoyNzk=')

	const showMessage = (text) => {
		message = text
		setTimeout(() => {
			message = ''
		}, 2000)
	}

	const addCashier = async () => {
		if (firstName != '') {
			const response = await cashier.addCashier(firstName, lastName)
			await getCashiers()
			showMessage('Terminal agregado')
			firstName = ''
			lastName = ''
		}
	}

	const delCashier = async (id) => {
		if (confirm('¿Estás seguro de que quieres borrar este cashier?')) {
			const response = await cashier.delCashier(id)
			await getCashiers()
			showMessage('Cashier eliminado')
			return
		}
		showMessage('No se pudo borrar el cashier')
	}

	const setCashierActive = async (cashierId, active) => {
		console.log({ cashierId }, !active)
		try {
			const response = await cashier.changeCashierActive(cashierId, !active)
			console.log('setCashierActive', { response })
			await getCashiers()
			showMessage('Cashier actualizado')
		} catch (error) {
			console.error('setCashierActive', { error })
		}
	}
</script>

<div class="cashiers-container">
	<div class="section-name">Usuarios cashiers</div>
	<div class="cashiers">
		{#each cashierList as cashier (cashier.id)}
			{#if cashier.firstName.split('_')[1] != userSuper && cashier.firstName.split('_')[1] != 'Edwin'}
				<div class="cashier">
					<div class="cashier-main">
						<div class="cashier-name">
							<span>
								<Fa icon={faCreditCard} size=".8x" />
							</span>
							<span>{cashier.firstName.split('_')[1]}</span>
						</div>
						<!-- <div class="cashier-email">
							<span>Email:</span>
							{cashier.email}
						</div> -->
						<div class="cashier-last">
							<span>Últ. acceso: </span>
							{cashier.lastIn}
						</div>
						<div class="cashier-states">
							<div class="cashier-active">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<!-- svelte-ignore a11y-no-static-element-interactions -->
								<div
									class="mode key-switch-wrapper"
									class:active={cashier.isActive}
									on:click={() => {
										cashier.isActive = !cashier.isActive
									}}
									on:click={() => setCashierActive(cashier.id, !cashier.isActive)}
								>
									<div class="key-switch" class:active={cashier.isActive}></div>
								</div>
							</div>
							<!-- {#if cashier.firstName.split('_')[1] != 'Edwin' && cashier.firstName.split('_')[1] != 'Julian'} -->
							<button class="trash" on:click={() => delCashier(cashier.id)}>
								<Fa icon={faTrashAlt} size="1.3x" />
							</button>
							<!-- {/if} -->
						</div>
					</div>
				</div>
			{/if}
		{/each}

		<div class="cashier-add">
			<div class="cashier-inputs">
				<input class="input-name" type="text" placeholder="Nombre" bind:value={firstName} title="Nombre del cashier" />
				<input type="text" placeholder="Apellido" bind:value={lastName} title="Apellido del cashier" />
			</div>
			<div class="cashier-button-add">
				<button class="agregar" on:click={addCashier} disabled={firstName === '' && lastName === ''}> Agregar </button>
			</div>
		</div>
	</div>
</div>
