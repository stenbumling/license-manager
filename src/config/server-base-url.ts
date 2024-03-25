// This will dynamically set the server base url based on the environment

export const serverBaseUrl =
	import.meta.env.DEV || process.env.NODE_ENV === 'test'
		? ''
		: process.env.SERVER_BASE_URL || 'no-server-base-url-set';
