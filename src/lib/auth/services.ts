import { REDIRECT_URI } from '$env/static/private';
import { ConfidentialClientApplication, CryptoProvider, ResponseMode } from '@azure/msal-node';
import type { RequestEvent } from '@sveltejs/kit';
import { cookiesConfig, msalConfig } from './config';

/**
 * These functions are used to handle the authentication flow with Azure AD.
 * See the config.ts file for the configuration of the MSAL library.
 */

const provider = (function () {
	let msalInstance: ConfidentialClientApplication | null = null;
	return () => {
		if (msalInstance === null) {
			msalInstance = new ConfidentialClientApplication(msalConfig);
		}
		return msalInstance;
	};
})();

const cryptoProvider = new CryptoProvider();

export const redirectToAuthCodeUrl = async (event: RequestEvent) => {
	const msalInstance = provider();
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
		redirectUri: process.env.REDIRECT_URI || REDIRECT_URI || 'no-redirect-uri-set',
		responseMode: ResponseMode.QUERY,
		codeChallenge: pkceCodes.challenge,
		codeChallengeMethod: pkceCodes.challengeMethod,
		scopes: [],
		state,
	};

	try {
		const authCodeUrl = await msalInstance.getAuthCodeUrl(authCodeUrlRequest);
		event.cookies.set('pkceVerifier', verifier, cookiesConfig);
		event.cookies.set('csrfToken', csrfToken, cookiesConfig);
		return authCodeUrl;
	} catch (err) {
		console.log(err);
	}
};

export const getTokens = async (event: RequestEvent) => {
	const msalInstance = provider();
	const state = event.url.searchParams.get('state');
	if (state) {
		const decodedState = JSON.parse(cryptoProvider.base64Decode(state));
		const csrfToken = event.cookies.get('csrfToken');
		if (decodedState.csrfToken === csrfToken) {
			const code = event.url.searchParams.get('code');
			const error = event.url.searchParams.get('error');
			if (code) {
				const authCodeRequest = {
					redirectUri: process.env.REDIRECT_URI || REDIRECT_URI || 'no-redirect-uri-set',
					code,
					scopes: [],
					codeVerifier: event.cookies.get('pkceVerifier'),
				};
				try {
					const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest);
					event.cookies.set('accessToken', tokenResponse.accessToken, cookiesConfig);
					event.cookies.set('idToken', tokenResponse.idToken, cookiesConfig);
					event.cookies.set('account', JSON.stringify(tokenResponse.account), cookiesConfig);
					return decodedState.redirectTo;
				} catch (err) {
					console.log(error);
				}
			} else if (error) {
				throw new Error(error);
			}
		} else {
			throw new Error('CSRF token mismatch');
		}
	} else {
		throw new Error('State parameter missing');
	}
};
