import License from '$lib/server/models/license-model';
import {
	updateLicenseAssociations,
	updateUserAssociations,
} from '$lib/server/utils/associations-utils';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { GET, POST } from './+server';

describe('GET /licenses', () => {
	it('should return 200 on successful fetch', async () => {
		vi.mocked(License.findAll).mockResolvedValue([]);

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});
});

describe('POST /licenses', () => {
	it('should return 204 on successful update', async () => {
		vi.mocked(License.create).mockResolvedValue({
			id: uuidv4(),
			name: 'Test license',
			setUsers: vi.fn(),
		});
		vi.mocked(updateUserAssociations).mockResolvedValue(null);
		vi.mocked(updateLicenseAssociations).mockResolvedValue(null);

		const response = await POST({
			request: {
				json: async () => ({
					id: uuidv4(),
					name: 'Test License',
					users: [
						{ id: 1, name: 'Test user one' },
						{ id: 2, name: 'Test user two' },
					],
				}),
			},
		});

		expect(response.status).toBe(204);
	});
});
