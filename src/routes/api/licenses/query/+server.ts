import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { constructOrderClause, constructWhereClause } from '$lib/server/services/query-services';
import type { Filter, SortBy, SortDirection } from '$lib/server/types/query-types';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const queryParams = Object.fromEntries(url.searchParams);
	const { search = '', filter = 'all', sortBy = 'createdAt', sortDirection = 'DESC' } = queryParams;
	// Selects licenses based on the filter and search query parameters
	const where = constructWhereClause(filter as Filter, search as string);

	// Sorts the licenses based on the sortBy and sortDirection query parameters
	const order = constructOrderClause(sortBy as SortBy, sortDirection as SortDirection);

	const licenses = await License.findAll({
		where,
		include: [
			{
				model: Application,
				as: 'application',
				attributes: { exclude: ['createdAt'] },
			},
			{
				model: User,
				attributes: { exclude: ['createdAt'] },
				through: { attributes: [] },
			},
		],
		order,
	});
	return json(licenses, { status: 200 });
}
