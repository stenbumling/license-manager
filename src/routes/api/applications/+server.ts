import {
	createApplication,
	fetchAllApplications,
} from '$lib/server/services/application-services.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	const applications = await fetchAllApplications();
	return json(applications, { status: 200 });
}

export async function POST({ request }) {
	const app = await request.json();
	const addedApp = await createApplication(app);
	return json(addedApp, { status: 201 });
}
