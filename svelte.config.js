import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

/*
 * This project is using the `adapter-node` library (https://svelte.dev/docs/kit/adapter-node) for building
 * the application as a Node.js server. The chosen adapter doesn't matter for local development, but this particular adapter is necessary
 * for deploying it on Azure as an Azure App Service.
 * 
 * If you want to use a different adapter, you can change it in the`svelte.config.js` file.
 * Check https://svelte.dev/docs/kit/adapters for more information on different kind of adapters.
 */	

// Load environment variables depending on the environment
dotenv.config({ path: ['.env.local', '.env'] });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		adapter: adapter(),
	},
};

export default config;
