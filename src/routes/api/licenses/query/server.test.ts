import License from '$lib/server/models/license-model';
import { constructOrderClause, constructWhereClause } from '$lib/server/utils/query-utils';
import { describe, expect, it, vi } from 'vitest';
import { GET } from './+server';

vi.mock('$lib/server/utils/query-utils');
vi.mock('$lib/server/models/license-model');

describe('GET /licenses/query', () => {
	it('should return 200 on successful fetch', async () => {
		const mockURL = {
			searchParams: new URLSearchParams({
				filter: 'unassigned',
				sortBy: 'contactPerson',
				sortDirection: 'ASC',
			}),
		};
		vi.mocked(constructWhereClause).mockReturnValue({});
		vi.mocked(constructOrderClause).mockReturnValue([]);
		vi.mocked(License.findAll).mockResolvedValue([]);

		const response = await GET({ url: mockURL });
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});
});
