import { createApplication, fetchAllApplications } from '$lib/server/services/application-services';
import type { ApplicationData } from '$lib/types/application-types';
import { json } from '@sveltejs/kit';

export async function GET() {
	const applications = await fetchAllApplications();
	return json(applications, { status: 200 });
}

export async function POST({ request }) {
	const app: ApplicationData = await request.json();

	await createApplication(app);
	return new Response(null, { status: 201 });
}
