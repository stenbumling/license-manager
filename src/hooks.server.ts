import { redirectToAuthCodeUrl } from '$lib/auth/services';
import { error, redirect, type Handle } from '@sveltejs/kit';

/**
 * This hook is used to check if the user is authenticated before allowing access
 * to the route (which currently is the whole application).
 */

export const handle: Handle = async ({ event, resolve }) => {
	if (!(event.route.id && event.route.id.includes('callback'))) {
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

	return await resolve(event);
};
