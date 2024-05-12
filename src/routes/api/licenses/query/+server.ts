import { fetchLicensesByQuery } from '$lib/server/services/license-services';
import type { QueryParams } from '$lib/types/query-types';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const queryParams = Object.fromEntries(url.searchParams);
	const {
		search = '',
		filter = 'all',
		sortColumn = 'createdAt',
		sortDirection = 'DESC',
	} = queryParams as unknown as QueryParams;

	const licenses = await fetchLicensesByQuery(filter, search, sortColumn, sortDirection);
	return json(licenses, { status: 200 });
}
