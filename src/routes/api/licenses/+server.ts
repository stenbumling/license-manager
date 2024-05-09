import { createLicense } from '$lib/server/services/license-services';

export async function POST({ request }) {
	const { users, ...licenseData } = await request.json();
	await createLicense(licenseData, users);
	return new Response(null, { status: 204 });
}
