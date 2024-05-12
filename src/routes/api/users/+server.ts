import { getUsersFromDatabase } from '$lib/server/services/user-services';
import { json } from '@sveltejs/kit';

export async function GET() {
	const users = await getUsersFromDatabase();
	return json(users, { status: 200 });
}
