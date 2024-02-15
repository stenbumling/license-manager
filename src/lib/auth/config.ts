import {
	AZURE_CLIENT_ID,
	AZURE_CLIENT_SECRET,
	AZURE_CLOUD_INSTANCE,
	AZURE_TENANT_ID,
} from '$env/static/private';

export const msalConfig = {
	auth: {
		clientId: process.env.AZURE_CLIENT_ID || AZURE_CLIENT_ID,
		authority:
			(process.env.AZURE_CLOUD_INSTANCE || AZURE_CLOUD_INSTANCE) +
			(process.env.AZURE_TENANT_ID || AZURE_TENANT_ID),
		clientSecret: process.env.AZURE_CLIENT_SECRET || AZURE_CLIENT_SECRET,
	},
};
