import { getAzureAdGroupMembers } from '$lib/server/services/user-services';
import { error, json } from '@sveltejs/kit';

export async function GET(event) {
	const token = event.cookies.get('accessToken');
	if (!token) {
		error(401, {
			status: 401,
			type: 'Unauthorized',
			message: 'No access token found',
			details: 'Please sign in to access this resource.',
		});
	}
	const users = await getAzureAdGroupMembers(token);
	return json(users, { status: 200 });
}
