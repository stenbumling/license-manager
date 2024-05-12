import { dev } from '$app/environment';
import { ConfidentialClientApplication, type Configuration } from '@azure/msal-node';

const { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_CLOUD_INSTANCE, AZURE_TENANT_ID } = process.env;

/**
 * This is used to configure the MSAL library for authentication to Azure AD.
 * Client ID, Tenant ID, and Client Secret should be set in the environment variables.
 * The client secret in particular should be kept in a key vault or other secure location.
 */
export const msalConfig: Configuration = {
	auth: {
		clientId: AZURE_CLIENT_ID || 'no-client-id-set',
		authority:
			(AZURE_CLOUD_INSTANCE || 'https://login.microsoftonline.com') +
			(AZURE_TENANT_ID || 'no-tenant-id-set'),
		clientSecret: AZURE_CLIENT_SECRET || 'no-client-secret-set',
	},
};

export const msalInstanceProvider = (() => {
	let msalInstance: ConfidentialClientApplication | null = null;
	return () => {
		if (msalInstance === null) {
			msalInstance = new ConfidentialClientApplication(msalConfig);
		}
		return msalInstance;
	};
})();

export const cookiesConfig = {
	httpOnly: true,
	path: '/',
	secure: !dev,
};

/**
 * The permissions required by the application to access the app.
 * They need to be set in the Azure AD application registration.
 */
export const graphApiPermissions = [
	'https://graph.microsoft.com/User.Read',
	// TODO: Add the permissions below when admin has consented to them
	// 'https://graph.microsoft.com/GroupMember.Read.All',
	// 'https://graph.microsoft.com/User.Read.All',
	'offline_access',
];
