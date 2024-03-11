/// <reference types="vitest" />

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
	plugins: [sveltekit()],
	server: {
		// Proxy will only work in development mode
		proxy: {
			// '/api': 'https://nexer-orebro-license-app-server.azurewebsites.net',
			'/api': 'http://localhost:3000',
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
	},
}));
