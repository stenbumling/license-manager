import { getAzureAdGroupMembers } from '$lib/server/utils/getAzureAdGroupMembers';
import { GET as getUsersFromDatabase } from '../+server';

export async function PUT(event) {
	const azureAdUsers = await getAzureAdGroupMembers(event);
	const response = await getUsersFromDatabase();
	const dbUsers = await response.json();
	console.log('Azure AD users', azureAdUsers);
	console.log('dbUsers', dbUsers);

	return new Response(null, { status: 204 });
}

// 1. fetch data from Azure AD
// 2. fetch data from my user table
// 3. compare the two datasets
//    a) if a user is in Azure AD but not in my user table, create a new user
//    b) if a user is in my user table but not in Azure AD, delete the user.
//        If the user is associated with any licenses, flag the user as inactive instead
//    c) if a user is in both and they differ, update the user's details in my user table
// 4. update the user table with the new data
// 5. (optional) return the updated user data
