import LicenseModel from '$lib/server/models/license-model';
import { updateLicenseAssociations } from '$lib/server/services/application-services';
import { updateUserAssociations } from '$lib/server/services/license-services';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { POST } from './+server';

describe('POST /licenses', () => {
	it('should return 204 on successful update', async () => {
		vi.mocked(LicenseModel.create).mockResolvedValue({
			id: uuidv4(),
			name: 'Test license',
			setUsers: vi.fn(),
		});
		const mockedUpdateUserAssocations = vi.fn(updateUserAssociations);
		const mockedUpdateLicenseAssociations = vi.fn(updateLicenseAssociations);
		vi.mocked(mockedUpdateUserAssocations).mockResolvedValue(null);
		vi.mocked(mockedUpdateLicenseAssociations).mockResolvedValue();

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
