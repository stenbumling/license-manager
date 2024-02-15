export const msalConfig = {
	auth: {
		clientId: process.env.AZURE_CLIENT_ID,
		authority: process.env.AZURE_CLOUD_INSTANCE + process.env.AZURE_TENANT_ID,
		clientSecret: process.env.AZURE_CLIENT_SECRET
	},
};
