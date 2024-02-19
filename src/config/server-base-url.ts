import { env } from '$env/dynamic/public';

// This will dynamically set the server base url based on the environment
export const serverBaseUrl = import.meta.env.PROD
	? process.env.SERVER_BASE_URL || env.PUBLIC_SERVER_BASE_URL || 'no-server-base-url-set'
	: '';
