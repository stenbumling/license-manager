// import {
// 	AZURE_KEY_VAULT_NAME,
// 	AZURE_CLIENT_SECRET,
// } from '$env/static/private';
// import { DefaultAzureCredential } from '@azure/identity';
// import { SecretClient } from '@azure/keyvault-secrets';
// import dotenv from 'dotenv';

// dotenv.config();

// const credential = new DefaultAzureCredential();
// console.log(credential);
// const keyVaultName = AZURE_KEY_VAULT_NAME;
// const url = `https://${keyVaultName}.vault.azure.net`;
// const client = new SecretClient(url, credential);
// const secretName = 'app-registration-secret';

// async function getSecret() {
// 	try {
// 		const secretBundle = await client.getSecret(secretName);
// 		return secretBundle.value;
// 	} catch (err) {
// 		console.error('Error fetching secret from Azure Key Vault:', err);
// 		console.log(err);
// 	}
// }

// async function getMsalConfig() {
// 	const clientSecret = await getSecret();
// 	return {
// 		auth: {
// 			clientId: '999330a6-2e5a-40a1-b4a4-3efbc25b9b7f',
// 			authority: 'https://login.microsoftonline.com/02b6749b-5ce0-4853-bd5c-a05f9bd9dd3a',
// 			clientSecret,
// 		},
// 	};
// }
// 
// export const msalConfig = await getMsalConfig();

export const msalConfig = {
	auth: {
		clientId: '999330a6-2e5a-40a1-b4a4-3efbc25b9b7f',
		authority: 'https://login.microsoftonline.com/' + '02b6749b-5ce0-4853-bd5c-a05f9bd9dd3a',
		clientSecret: process.env.AZURE_CLIENT_SECRET,
		// clientSecret: AZURE_CLIENT_SECRET,
	},
};
