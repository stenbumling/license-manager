import {
	AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET,
	AZURE_CLOUD_INSTANCE,
	AZURE_TENANT_ID,
} from '$env/static/private';

export const msalConfig = {
	auth: {
		clientId: process.env.AZURE_CLIENT_ID || AZURE_CLIENT_ID || 'no-client-id-set',
		authority:
			(process.env.AZURE_CLOUD_INSTANCE || AZURE_CLOUD_INSTANCE || 'https://login.microsoftonline.com') +
			(process.env.AZURE_TENANT_ID || AZURE_TENANT_ID || 'no-tenant-id-set'),
		clientSecret: process.env.AZURE_CLIENT_SECRET || AZURE_CLIENT_SECRET || 'no-client-secret-set',
	},
};
