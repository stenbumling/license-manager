import { dev } from '$app/environment';
import {
	AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET,
	AZURE_CLOUD_INSTANCE,
	AZURE_TENANT_ID,
} from '$env/static/private';

/**
 * This is used to configure the MSAL library for authentication to Azure AD.
 * Client ID, Tenant ID, and Client Secret should be set in the environment variables.
 * The client secret in particular should be kept in a key vault or other secure location.
 */

export const msalConfig = {
	auth: {
		clientId: process.env.AZURE_CLIENT_ID || AZURE_CLIENT_ID || 'no-client-id-set',
		authority:
			(process.env.AZURE_CLOUD_INSTANCE ||
				AZURE_CLOUD_INSTANCE ||
				'https://login.microsoftonline.com') +
			(process.env.AZURE_TENANT_ID || AZURE_TENANT_ID || 'no-tenant-id-set'),
		clientSecret: process.env.AZURE_CLIENT_SECRET || AZURE_CLIENT_SECRET || 'no-client-secret-set',
	},
};

export const cookiesConfig = {
	httpOnly: true,
	path: '/',
	secure: !dev,
};