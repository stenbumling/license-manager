import { getAzureAdGroupMembers } from '$lib/server/utils/getAzureAdGroupMembers';
import { json } from '@sveltejs/kit';

export async function GET(event) {
	const users = await getAzureAdGroupMembers(event);
	return json(users, { status: 200 });
}
