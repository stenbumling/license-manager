import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// '/api': 'https://nexer-orebro-license-app.azurewebsites.net',
			'/api': 'http://localhost:3000',
		},
	},
});
