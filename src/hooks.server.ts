import { redirectToAuthCodeUrl } from '$lib/auth/services';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!(event.route.id && event.route.id.includes('callback'))) {
		if (!event.cookies.get('idToken') || !event.cookies.get('accessToken')) {
			const authCodeUrl = await redirectToAuthCodeUrl(event);
			if (authCodeUrl) redirect(302, authCodeUrl);
		}
	}
	return await resolve(event);
};
