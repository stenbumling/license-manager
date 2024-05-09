import { deleteLicense, getLicense, updateLicense } from '$lib/server/services/license-services';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const id = params.id;
	const license = await getLicense(id);
	return json(license, { status: 200 });
}

export async function PUT({ params, request }) {
	const id = params.id;
	const data = await request.json();
	await updateLicense(id, data);
	return new Response(null, { status: 204 });
}

export async function DELETE({ params }) {
	const id = params.id;
	await deleteLicense(id);
	return new Response(null, { status: 204 });
}
