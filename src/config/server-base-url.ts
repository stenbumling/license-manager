import { PUBLIC_SERVER_BASE_URL } from '$env/static/public';

// This will dynamically set the server base url based on the environment
export const serverBaseUrl = import.meta.env.PROD
	? process.env.PUBLIC_SERVER_BASE_URL || PUBLIC_SERVER_BASE_URL
	: '';
