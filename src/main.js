import App from './App.svelte'
import * as Sentry from '@sentry/svelte'

const enviroment = import.meta.env.VITE_SITE

/* 
if (enviroment != 'staging' && enviroment != 'localhost') {
	Sentry.init({
		dsn: 'https://18fe97cada5423ffcc22225d06535a27@o4507981062012928.ingest.us.sentry.io/4507981064962048',
		integrations: [
			Sentry.httpClientIntegration(),
			Sentry.httpContextIntegration(),
			Sentry.globalHandlersIntegration(),
			Sentry.debugIntegration(),
			Sentry.extraErrorDataIntegration(),
			Sentry.browserApiErrorsIntegration(),
			Sentry.captureConsoleIntegration(),
			Sentry.browserTracingIntegration(),
			Sentry.replayIntegration(),
		],
		// Tracing
		tracesSampleRate: 1.0, //  Capture 100% of the transactions
		// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
		tracePropagationTargets: ['localhost', /^https:\/\/attenpo-pos\.nxlabs\.io/],
		// Session Replay
		replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
		replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
	})
}
 */

new App({
	target: document.body,
	hydrate: import.meta.env.ROUTIFY_SSR_ENABLE,
})
