import { building } from '$app/environment';
import { SKIP_AUTH } from '$env/static/private';
import { redirectToAuthCodeUrl } from '$lib/auth/services';
import { initDb } from '$lib/server/db';
import { error, redirect, type Handle } from '@sveltejs/kit';

// Initialize the database connection on startup
if (!building) {
	await initDb();
}

/**
 * Check if the user is authenticated before allowing access to the app.
 * Set SKIP_AUTH to 'true' in the env.local file to skip authentication.
 * In production, the SKIP_AUTH variable will not be accessible to the client, so
 * it will always be set to 'false'.
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

	// Used to preload fonts (only css and js are preloaded by default otherwise)
	const response = await resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js',
	});

	return response;
};
