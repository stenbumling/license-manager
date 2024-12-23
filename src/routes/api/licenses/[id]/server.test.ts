import LicenseModel from '$lib/server/models/license-model';
import { updateLicenseAssociations } from '$lib/server/services/application-services';
import { updateUserAssociations } from '$lib/server/services/license-services';
import type { LicenseInstance } from '$lib/types/license-types';
import type { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { DELETE, GET, PUT } from './+server';

describe('GET /licenses/:id', () => {
	it('should return 200 on successful fetch', async () => {
		vi.mocked(LicenseModel.findByPk).mockResolvedValue({ id: uuidv4() } as LicenseInstance);

		const response = await GET({ params: { id: uuidv4() } });
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ id: expect.any(String) });
	});

	it('should return 404 when license does not exist', async () => {
		vi.mocked(LicenseModel.findByPk).mockResolvedValue(null);

		try {
			await GET({ params: { id: uuidv4() } });
			expect.fail('Should have thrown an error');
		} catch (error) {
			const typedError = error as {
				status: number;
				body: App.Error;
			};

			expect(typedError.status).toBe(404);
			expect(typedError.body).toHaveProperty('type', 'NotFound');
		}
	});
});

describe('PUT /licenses/:id', () => {
	it('should return 204 on successful update', async () => {
		vi.mocked(LicenseModel.update).mockResolvedValue([1]);
		vi.mocked(LicenseModel.findByPk).mockResolvedValue({ id: uuidv4() } as LicenseInstance);
		vi.mocked(LicenseModel.findByPk).mockResolvedValue({
			id: uuidv4(),
			name: 'Test license',
			setUsers: vi.fn(),
		} as unknown as Model);
		const mockedUpdateUserAssocations = vi.fn(updateUserAssociations);
		const mockedUpdateLicenseAssociations = vi.fn(updateLicenseAssociations);
		vi.mocked(mockedUpdateUserAssocations).mockResolvedValue(null);
		vi.mocked(mockedUpdateLicenseAssociations).mockResolvedValue();

		const response = await PUT({
			params: { id: uuidv4() },
			request: {
				json: async () => ({
					updatedLicense: {
						id: 15,
						name: 'Test License',
						users: [
							{ id: 1, name: 'Test user one' },
							{ id: 2, name: 'Test user two' },
						],
						updatedAt: new Date(2000, 0, 1).toISOString(),
					},
					currentLicense: {
						id: 15,
						name: 'Test License',
						users: [
							{ id: 1, name: 'Test user one' },
							{ id: 2, name: 'Test user two' },
						],
						updatedAt: new Date(2000, 0, 1).toISOString(),
					},
				}),
			},
		});

		expect(response.status).toBe(204);
	});

	it('should return 409 when license has been modified since last retrieval', async () => {
		vi.mocked(LicenseModel.update).mockResolvedValue([0]);
		vi.mocked(LicenseModel.findByPk).mockResolvedValue({ id: uuidv4() } as LicenseInstance);

		try {
			await PUT({
				params: { id: uuidv4() },
				request: {
					json: async () => ({
						updatedLicense: {
							id: 15,
							name: 'Test License',
							users: [],
							updatedAt: new Date(2000, 0, 1).toISOString(),
						},
						currentLicense: {
							id: 15,
							name: 'Test License',
							users: [],
							updatedAt: new Date(2000, 0, 1).toISOString(),
						},
					}),
				},
			});
			expect.fail('Should have thrown an error');
		} catch (error) {
			const typedError = error as {
				status: number;
				body: App.Error;
			};

			expect(typedError.status).toBe(409);
			expect(typedError.body).toHaveProperty('type', 'UpdateConflict');
		}
	});
});

describe('DELETE /licenses/:id', () => {
	it('should return 204 on successful deletion', async () => {
		const mockedUpdateLicenseAssociations = vi.fn(updateLicenseAssociations);
		vi.mocked(mockedUpdateLicenseAssociations).mockResolvedValue();
		vi.mocked(LicenseModel.findByPk).mockResolvedValue({
			destroy: vi.fn(),
		} as unknown as Model);

		const response = await DELETE({ params: { id: uuidv4() } });

		expect(response.status).toBe(204);
	});

	it('should return 404 when license cannot be found', async () => {
		vi.mocked(LicenseModel.findByPk).mockResolvedValue(null);

		try {
			await DELETE({ params: { id: uuidv4() } });
			expect.fail('Should have thrown an error');
		} catch (error) {
			const typedError = error as {
				status: number;
				body: App.Error;
			};

			expect(typedError.status).toBe(404);
			expect(typedError.body).toHaveProperty('type', 'NotFound');
		}
	});
});
