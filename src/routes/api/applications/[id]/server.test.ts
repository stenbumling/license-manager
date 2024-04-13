import Application from '$lib/server/models/application-model';
import type { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { DELETE, PUT } from './+server';

describe('PUT /applications/:id', () => {
	it('should return 204 on successful update', async () => {
		vi.mocked(Application.update).mockResolvedValue([1]);

		const response = await PUT({
			params: { id: uuidv4() },
			request: {
				json: async () => ({
					name: 'Updated application',
					updatedAt: new Date().toISOString(),
				}),
			},
		});

		expect(response.status).toBe(204);
	});
	it('should return 409 if the application was modified since last retrieved', async () => {
		vi.mocked(Application.update).mockResolvedValue([0]);

		try {
			await PUT({
				params: { id: uuidv4() },
				request: {
					json: async () => ({
						name: 'Updated application',
						updatedAt: new Date(2000, 0, 1).toISOString(),
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

describe('DELETE /applications/:id', () => {
	it('should return 204 on successful deletion', async () => {
		const mockDestroy = vi.fn();
		vi.mocked(Application.findByPk).mockResolvedValue({
			destroy: mockDestroy,
			dataValues: { licenseAssociations: 0 },
		} as unknown as Model);

		const response = await DELETE({ params: { id: uuidv4() } });

		expect(response.status).toBe(204);
		expect(mockDestroy).toHaveBeenCalled();
	});

	it('should return 404 when application is not found', async () => {
		vi.mocked(Application.findByPk).mockResolvedValue(null);

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

	it('should return 409 when there are licenses associated with the application', async () => {
		vi.mocked(Application.findByPk).mockResolvedValue({
			dataValues: { licenseAssociations: 1 },
		} as unknown as Model);

		try {
			await DELETE({ params: { id: uuidv4() } });
			expect.fail('Should have thrown an error');
		} catch (error) {
			const typedError = error as {
				status: number;
				body: App.Error;
			};

			expect(typedError.status).toBe(409);
			expect(typedError.body).toHaveProperty('type', 'DataDeletionError');
		}
	});
});
