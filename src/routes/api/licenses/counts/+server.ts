import { getLicenseCounts } from '$lib/server/services/license-services';
import { json } from '@sveltejs/kit';

export async function GET() {
	const licenseCounts = await getLicenseCounts();
	return json(licenseCounts, { status: 200 });
}
