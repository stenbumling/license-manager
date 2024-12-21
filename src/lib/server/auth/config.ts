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
 * The permissions required by the application for access.
 * They need to be set in the Azure AD application registration.
 * 
 * 1. Go to the Azure Portal
 * 2. Go to Azure Active Directory
 * 3. Go to App registrations
 * 4. Find the app registration for this app
 * 5. Go to API permissions
 * 6. Add permissions
 * 7. Select Microsoft Graph
 * 8. Add the permissions below
 * 
 * Note: Some permissions require admin consent.
 */
export const graphApiPermissions = [
	'https://graph.microsoft.com/User.Read', // Required for logging into the app
	'https://graph.microsoft.com/GroupMember.Read.All', // Required for accessing group members
	'https://graph.microsoft.com/User.Read.All', // Required for accessing all users in the tenant
	'offline_access', // Required for refresh tokens
];
