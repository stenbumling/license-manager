import { deleteApplication, updateApplication } from '$lib/server/services/application-services';

export async function PUT({ params, request }) {
	const id = params.id;
	const { updatedAt, ...app } = await request.json();

	await updateApplication(id, app, updatedAt);
	return new Response(null, { status: 204 });
}

export async function DELETE({ params }) {
	const id = params.id;
	await deleteApplication(id);
	return new Response(null, { status: 204 });
}
