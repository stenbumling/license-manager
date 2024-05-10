import { createLicense } from '$lib/server/services/license-services';
import type { LicenseData } from '$lib/types/license-types';

export async function POST({ request }) {
	const license: LicenseData = await request.json();

	await createLicense(license);
	return new Response(null, { status: 204 });
}
