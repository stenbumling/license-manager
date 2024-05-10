import { deleteApplication, updateApplication } from '$lib/server/services/application-services';
import type { ApplicationData } from '$lib/types/application-types.js';

export async function PUT({ params, request }) {
	const id = params.id;
	const app: ApplicationData = await request.json();

	await updateApplication(id, app);
	return new Response(null, { status: 204 });
}

export async function DELETE({ params }) {
	const id = params.id;

	await deleteApplication(id);
	return new Response(null, { status: 204 });
}
