import { getTokens } from '$lib/auth/services';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (event.cookies.get('idToken') && event.cookies.get('accessToken')) {
		redirect(302, '/');
	} else {
		const redirectTo = await getTokens(event);
		if (redirectTo) {
			redirect(302, redirectTo);
		} else {
			error(401, {
				status: 401,
				type: 'Authentication Error',
				message: 'There was an error trying to authenticate user',
			});
		}
	}
};
