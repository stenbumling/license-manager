import { getTokens } from '$lib/auth/services';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const redirectTo = await getTokens(event);
	redirect(302, redirectTo);
};
