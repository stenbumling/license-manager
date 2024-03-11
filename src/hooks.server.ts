import { SKIP_AUTH } from '$env/static/private';
import { redirectToAuthCodeUrl } from '$lib/auth/services';
import { error, redirect, type Handle } from '@sveltejs/kit';

/**
 * This hook is used to check if the user is authenticated before allowing access
 * to the route (which currently is the whole application). Set SKIP_AUTH to 'true'
 * in the env.local file to skip authentication. In production, the SKIP_AUTH variable
 * will not be accessible to the client, so it will always be 'false'.
 */
export const handle: Handle = async ({ event, resolve }) => {
	if (SKIP_AUTH !== 'true' && !(event.route.id && event.route.id.includes('callback'))) {
		if (!event.cookies.get('idToken') || !event.cookies.get('accessToken')) {
			const authCodeUrl = await redirectToAuthCodeUrl(event);
			if (authCodeUrl) {
				redirect(302, authCodeUrl);
			} else {
				console.error('Failed to redirect to authentication page');
				error(500, { message: 'Failed to redirect to authentication page' });
			}
		}
	}

	const response = await resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js',
	});

	return response;
};
