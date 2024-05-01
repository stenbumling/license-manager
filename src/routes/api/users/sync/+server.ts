import { getAzureAdGroupMembers, getUsersFromDatabase } from '$lib/server/services/user-services';
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
	console.log('Azure AD users', azureAdUsers);
	console.log('dbUsers', dbUsers);

	return new Response(null, { status: 204 });
}

// // 1. fetch data from Azure AD
// // 2. fetch data from my user table
// 3. compare the two datasets
//    a) if a user is in Azure AD but not in my user table, create a new user
//    b) if a user is in my user table but not in Azure AD, delete the user.
//        If the user is associated with any licenses, flag the user as inactive instead
//    c) if a user is in both and they differ, update the user's details in my user table
// 4. update the user table with the new data
// 5. (optional) return the updated user data
