import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'
import { mdsvex } from 'mdsvex'
import { resolve } from 'path'
import postCssNesting from 'postcss-nesting'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
	clearScreen: false,
	resolve: { alias: { '@': resolve('src') } },

	test: {
		environment: 'jsdom',
		globals: true,
		server: {
			deps: { inline: ['@roxi/routify'] },
		},
	},
	plugins: [
		routify({
			ssr: { enable: true }, // Server Side rendering
			ssg: { enable: true }, // Static Site Generation
			csr: { enable: true }, // Client Side Rendering, enabled by default
		}),
		svelte({
			compilerOptions: {
				dev: !production,
				hydratable: !!process.env.ROUTIFY_SSR_ENABLE,
			},
			extensions: ['.md', '.svelte'],
			preprocess: [mdsvex({ extension: 'md' })],
		}),
	],
	publicDir: 'assets',
	css: { postcss: { plugins: [postCssNesting()] } },
	server: { port: 1340 },
})
