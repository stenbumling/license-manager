import {
	filterUsersForUserSync,
	getAzureAdGroupMembers,
	getUsersFromDatabase,
	syncUserTableWithAzureAdGroup,
} from '$lib/server/services/user-services';
import { error } from '@sveltejs/kit';

export async function PUT(event) {
	const token = event.cookies.get('accessToken');
	if (!token) {
		error(401, {
			status: 401,
			type: 'Unauthorized',
			message: 'No access token found',
			details: 'Please sign in to access this resource.',
		});
	}
	const azureAdUsers = await getAzureAdGroupMembers(token);
	const dbUsers = await getUsersFromDatabase();
	const filteredUsers = filterUsersForUserSync(azureAdUsers, dbUsers);
	await syncUserTableWithAzureAdGroup(azureAdUsers, filteredUsers);

	return new Response(null, { status: 204 });
}
