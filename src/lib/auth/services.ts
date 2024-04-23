import { ConfidentialClientApplication, CryptoProvider, ResponseMode } from '@azure/msal-node';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { cookiesConfig, msalConfig } from './config';

const { REDIRECT_URI } = process.env;

/*
 * These service functions are used to handle the authentication flow with Azure AD.
 * See the config.ts file for the configuration of the MSAL library.
 */

export async function authenticateUser(event: RequestEvent) {
	if (shouldAuthenticate(event)) {
		const authCodeUrl = await redirectToAuthCodeUrl(event);
		if (authCodeUrl) {
			redirect(302, authCodeUrl);
		} else {
			error(500, {
				status: 500,
				type: 'Authentication Error',
				message: 'Failed to redirect to authentication page',
			});
		}
	}
// 	const groupId = 'e8894564-860f-4bb7-9c84-db3d045802b7';
// 	const token = event.cookies.get('accessToken');
// 	const response = await fetch(
// 		`https://graph.microsoft.com/v1.0/groups/${groupId}/members?$select=id,displayName`,
// 		{
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		},
// 	);
// 	const data = await response.json();
// 	console.log(data);
}

/**
 * Set SKIP_AUTH to 'true' in the env.local file to skip authentication.
 * In production, the SKIP_AUTH variable will not be accessible to the client, so
 * it will always be set to 'false'.
 */
export function shouldAuthenticate(event: RequestEvent) {
	const isSkipAuth = process.env.SKIP_AUTH === 'true';
	const isCallbackRoute = event.route.id && event.route.id.includes('callback');
	const isAuthenticated = event.cookies.get('idToken') && event.cookies.get('accessToken');

	return !isSkipAuth && !isCallbackRoute && !isAuthenticated;
}

const msalInstanceProvider = (() => {
	let msalInstance: ConfidentialClientApplication | null = null;
	return () => {
		if (msalInstance === null) {
			msalInstance = new ConfidentialClientApplication(msalConfig);
		}
		return msalInstance;
	};
})();

const cryptoProvider = new CryptoProvider();

const graphApiPermissions = [
	'https://graph.microsoft.com/User.Read',
	'https://graph.microsoft.com/GroupMember.Read.All',
	'https://graph.microsoft.com/User.Read.All',
];

export async function redirectToAuthCodeUrl(event: RequestEvent) {
	const msalInstance = msalInstanceProvider();
	const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
	const pkceCodes = {
		challengeMethod: 'S256',
		verifier,
		challenge,
	};
	const csrfToken = cryptoProvider.createNewGuid();
	const state = cryptoProvider.base64Encode(
		JSON.stringify({
			csrfToken,
			redirectTo: event.url.pathname,
		}),
	);
	const authCodeUrlRequest = {
		redirectUri: REDIRECT_URI || 'no-redirect-uri-set',
		responseMode: ResponseMode.QUERY,
		codeChallenge: pkceCodes.challenge,
		codeChallengeMethod: pkceCodes.challengeMethod,
		scopes: graphApiPermissions
		,
		state,
	};

	const authCodeUrl = await msalInstance.getAuthCodeUrl(authCodeUrlRequest);
	event.cookies.set('pkceVerifier', verifier, cookiesConfig);
	event.cookies.set('csrfToken', csrfToken, cookiesConfig);
	return authCodeUrl;
}

export async function getTokens(event: RequestEvent) {
	const msalInstance = msalInstanceProvider();
	const state = event.url.searchParams.get('state');
	if (state) {
		const decodedState = JSON.parse(cryptoProvider.base64Decode(state));
		const csrfToken = event.cookies.get('csrfToken');
		if (decodedState.csrfToken === csrfToken) {
			const code = event.url.searchParams.get('code');
			if (code) {
				const authCodeRequest = {
					redirectUri: REDIRECT_URI || 'no-redirect-uri-set',
					code,
					scopes: graphApiPermissions
					,
					codeVerifier: event.cookies.get('pkceVerifier'),
				};
				const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest);
				event.cookies.set('accessToken', tokenResponse.accessToken, cookiesConfig);
				event.cookies.set('idToken', tokenResponse.idToken, cookiesConfig);
				event.cookies.set('account', JSON.stringify(tokenResponse.account), cookiesConfig);
				return decodedState.redirectTo;
			}
		}
	}
}
