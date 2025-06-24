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

	let inputs = Array(10).fill('')
	const digits = writable(inputs)

	function handleInput(event, index) {
		const { value } = event.target
		const validValue = value.replace(/[^0-9]/g, '').slice(0, 1)

		digits.update((current) => {
			current[index] = validValue
			return [...current]
		})

		if (validValue && index < inputs.length - 1) {
			document.getElementById(`digit-${index + 1}`).focus()
		}
	}

	function handleKeyDown(event, index) {
		if (event.key === 'Backspace' && !event.target.value && index > 0) {
			document.getElementById(`digit-${index - 1}`).focus()
		}
	}

	onMount(() => {
		document.getElementById('digit-0').focus()
	})
</script>

<div class="input-container">
	{#each $digits as digit, index}
		<input
			id="digit-{index}"
			type="text"
			class="digit-input"
			maxlength="1"
			bind:value={inputs[index]}
			on:input={(e) => handleInput(e, index)}
			on:keydown={(e) => handleKeyDown(e, index)}
		/>
	{/each}
</div>

<style>
	.digit-input {
		width: 3rem;
		height: 3rem;
		font-size: 1.5rem;
		text-align: center;
		margin: 0.2rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.input-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;
	}
</style>
