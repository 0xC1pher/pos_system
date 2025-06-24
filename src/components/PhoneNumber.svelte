<script context="module">
	export const preload = async () => {
		return {
			id: 'code-input',
		}
	}
</script>

<script>
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	let inputs = Array(12).fill('')
	inputs[0] = '5'
	inputs[1] = '2'
	const digits = writable(inputs)
	export let phoneNumber
	export let phoneNumberComplete
	// export let phonumberShow

	function handleInput(event, index) {
		const { value } = event.target
		const validValue = value.replace(/[^0-9]/g, '').slice(0, 1)

		if (validValue !== '') {
			digits.update((current) => {
				current[index] = validValue
				return [...current]
			})

			if (index < inputs.length - 1) {
				document.getElementById(`digit-${index + 1}`).focus()
			}
		} else {
			event.target.value = ''
		}

		checkIfComplete()
	}

	function handleKeyDown(event, index) {
		if (event.key === 'Backspace' && !event.target.value && index > 0) {
			document.getElementById(`digit-${index - 1}`).focus()
		}
	}

	function resetInputs() {
		digits.set(Array(12).fill(''))
		inputs = Array(12).fill('')
		document.getElementById('digit-0').focus()
		phoneNumberComplete = false
	}

	function disableInputs() {
		for (let i = 0; i < inputs.length; i++) {
			document.getElementById(`digit-${i}`).disabled = true
		}
	}

	function checkIfComplete() {
		digits.update((current) => {
			if (current.every((value) => value !== '')) {
				console.log('All digits are complete:', current.join(''))
				phoneNumberComplete = true
				// You can add more actions here when all digits are filled
			}
			phoneNumber = current.join('')
			return current
		})
	}

	onMount(() => {
		document.getElementById('digit-2').focus()
	})
</script>

<div class="input-container">
	<label for=""
		>Número de WhatsApp
		<!-- <button class="button-hidden" on:click={phonumberShow}><small>[Cancelar]</small></button> -->
		<button class="button-reset" on:click={resetInputs}>
			<Fa icon={faTimes} size="1.3x" />
		</button>
	</label>
	<div class="input-digitos">
		<!-- <Fa icon={faPlus} size=".9x" /> -->
		{#each $digits as digit, index}
			<input
				id="digit-{index}"
				type="text"
				class="digit-input {index < 2 ? 'country' : ''}"
				maxlength="1"
				bind:value={inputs[index]}
				on:input={(e) => handleInput(e, index)}
				on:keydown={(e) => handleKeyDown(e, index)}
				inputmode="numeric"
				onkeypress="if (event.key < '0' || event.key > '9') event.preventDefault();"
				autocomplete="off"
			/>
		{/each}
	</div>
</div>

<style>
	.digit-input {
		width: 1.1rem;
		height: 2rem;
		font-size: 1.2rem;
		text-align: center;
		margin: 0.1rem;
		border: none;
		border-bottom: 2px solid #ccc;
	}
	.digit-input.country {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}
	.input-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;
	}
	.input-digitos {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;
	}
	label {
		display: flex;
		justify-content: espace-between;
		align-items: center;
		gap: 15px;
	}
	.button-hidden {
		cursor: pointer;
		background: none;
		border: none;
		/* margin-left: 5px; */
	}
	.button-reset {
		cursor: pointer;
		/* background: none; */
		/* border: none; */
		margin-left: 25px;
	}
</style>
