import { fetchLicensesByQuery } from '$lib/server/services/license-services';
import type { Filter, SortBy, SortDirection } from '$lib/server/types/query-types';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const queryParams = Object.fromEntries(url.searchParams);
	const { search = '', filter = 'all', sortBy = 'createdAt', sortDirection = 'DESC' } = queryParams;

	const licenses = await fetchLicensesByQuery(
		filter as Filter,
		search as string,
		sortBy as SortBy,
		sortDirection as SortDirection,
	);
	return json(licenses, { status: 200 });
}
