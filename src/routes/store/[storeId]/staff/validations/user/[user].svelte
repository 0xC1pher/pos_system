<script>
	import Fa from 'svelte-fa'
	import { params } from '@roxi/routify'
	import { goto, url } from '@roxi/routify'
	import { vars } from '@/tools/variables'
	import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
	import { Jumper } from 'svelte-loading-spinners'
	$goto

	const WhatsApp = vars.WhatsApp

	export let user, storeId
	$: storeId = $params.storeId
	$: user = $params.user

	const saltar = () => {
		window.open(`https://wa.me/${WhatsApp}`, '_blank')
	}

	let validationId = false
	const validateUser = async () => {
		try {
			const response = await fetch(`${vars.staffValidation}${user}`)
			const data = await response.json()
			// take VALIDATION_ID from data
			validationId = data.validationId
			console.log('VALIDATE USER', { data })
			if (data.status === 'ok') {
				console.log('VALIDADO')
				watingValidation()
			}
		} catch (error) {
			console.log('NO VALIDADO')
		}
	}

	const init = async () => {
		await validateUser()
	}

	let interval

	const watingValidation = () => {
		clearInterval(interval)
		interval = setInterval(() => {
			checkingValidation()
			console.log('chequeando')
		}, vars.checkingDelay)
	}

	const checkingValidation = async () => {
		// validationResponse
		const response = await fetch(`/api/checkValidation/${user}`)
		const data = await response.json()
		console.log('CHECK VALIDATION', { data })
		// TODO: check if data.status === 'ok'
		// if so, clear interval and go to staff home page
		if (data.status === 'ok') {
			clearInterval(interval)
			$goto(`/cashRegister`)
		}
	}
</script>

<div class="home-container">
	<div class="home-staff-validation">
		Enviamos una confirmación a tu WhatsApp, por favor revísalo para confirmar tu ingreso
		<div class="waiting-validation">
			<Jumper size="150" color="#d26c2b" unit="px" duration="1s" />
		</div>
		<small>Aguardamos tu aprobación...</small>
	</div>
</div>
