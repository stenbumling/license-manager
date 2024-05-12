import { cookiesConfig, graphApiPermissions, msalInstanceProvider } from '$lib/server/auth/config';
import {
	CryptoProvider,
	InteractionRequiredAuthError,
	ResponseMode,
	type AuthorizationCodeRequest,
	type AuthorizationUrlRequest,
} from '@azure/msal-node';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';

const { REDIRECT_URI } = process.env;

/*
 * These service functions are used to handle the authentication flow with Azure AD.
 * Use the config.ts file for configuration of the MSAL library.
 */

/**
 * Set SKIP_AUTH to 'true' in the env.local file to skip authentication.
 * In production, the SKIP_AUTH variable will not be accessible to the client, so
 * it will always be set to 'false'.
 */
export async function shouldAuthenticate(event: RequestEvent) {
	const isSkipAuth = process.env.SKIP_AUTH === 'true';
	const isCallbackRoute = event.route.id && event.route.id.includes('callback');
	const hasValidToken = await validateToken(event);

	return !isSkipAuth && !isCallbackRoute && !hasValidToken;
}

export async function authenticateUser(event: RequestEvent) {
	const authCodeUrl = await generateAuthCodeUrl(event);
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

const cryptoProvider = new CryptoProvider();

export async function generateAuthCodeUrl(event: RequestEvent) {
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
	const authCodeUrlRequest: AuthorizationUrlRequest = {
		redirectUri: REDIRECT_URI || 'no-redirect-uri-set',
		responseMode: ResponseMode.QUERY,
		codeChallenge: pkceCodes.challenge,
		codeChallengeMethod: pkceCodes.challengeMethod,
		scopes: graphApiPermissions,
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
		const decodedState: { csrfToken: string; redirectTo: string } = JSON.parse(
			cryptoProvider.base64Decode(state),
		);
		const csrfToken = event.cookies.get('csrfToken');
		if (decodedState.csrfToken === csrfToken) {
			const code = event.url.searchParams.get('code');
			if (code) {
				const authCodeRequest: AuthorizationCodeRequest = {
					redirectUri: REDIRECT_URI || 'no-redirect-uri-set',
					code,
					scopes: graphApiPermissions,
					codeVerifier: event.cookies.get('pkceVerifier'),
				};

				const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest);

				event.cookies.set('accessToken', tokenResponse.accessToken, cookiesConfig);
				event.cookies.set('idToken', tokenResponse.idToken, cookiesConfig);
				event.cookies.set(
					'homeAccountId',
					tokenResponse.account?.homeAccountId ?? '',
					cookiesConfig,
				);
				event.cookies.delete('pkceVerifier', cookiesConfig);
				event.cookies.delete('csrfToken', cookiesConfig);

				return decodedState.redirectTo;
			}
		}
	}
}

export async function validateToken(event: RequestEvent) {
	const homeId = event.cookies.get('homeAccountId');
	if (!homeId) {
		return false;
	}

	const msalInstance = msalInstanceProvider();
	const account = await msalInstance.getTokenCache().getAccountByHomeId(homeId);

	if (!account) {
		return false;
	}

	const silentRequest = {
		account: account,
		scopes: graphApiPermissions,
	};

	try {
		const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);

		event.cookies.set('accessToken', tokenResponse.accessToken, cookiesConfig);
		event.cookies.set('idToken', tokenResponse.idToken, cookiesConfig);

		return true;
	} catch (err) {
		if (err instanceof InteractionRequiredAuthError) {
			return false;
		} else {
			throw err;
		}
	}
}
