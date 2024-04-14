import { dev } from '$app/environment';

const { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_CLOUD_INSTANCE, AZURE_TENANT_ID } = process.env;

/**
 * This is used to configure the MSAL library for authentication to Azure AD.
 * Client ID, Tenant ID, and Client Secret should be set in the environment variables.
 * The client secret in particular should be kept in a key vault or other secure location.
 */
export const msalConfig = {
	auth: {
		clientId: AZURE_CLIENT_ID || 'no-client-id-set',
		authority:
			(AZURE_CLOUD_INSTANCE || 'https://login.microsoftonline.com') +
			(AZURE_TENANT_ID || 'no-tenant-id-set'),
		clientSecret: AZURE_CLIENT_SECRET || 'no-client-secret-set',
	},
};

export const cookiesConfig = {
	httpOnly: true,
	path: '/',
	secure: !dev,
};
