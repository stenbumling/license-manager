import LicenseModel from '$lib/server/models/license-model';
import { describe, expect, it, vi } from 'vitest';
import { GET } from './+server';

describe('GET /licenses/counts', () => {
	it('should return 200 and data on successful fetch', async () => {
		vi.mocked(LicenseModel.count)
			.mockResolvedValueOnce(7)
			.mockResolvedValueOnce(6)
			.mockResolvedValueOnce(1)
			.mockResolvedValueOnce(2)
			.mockResolvedValueOnce(2)
			.mockResolvedValueOnce(0);

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({
			all: 7,
			inUse: 6,
			unassigned: 1,
			inactive: 2,
			nearExpiration: 2,
			expired: 0,
		});
	});
});
