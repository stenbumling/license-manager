import User from '$lib/server/models/user-model';
import type { Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { DELETE } from './+server';

vi.mock('$lib/server/models/user-model');

describe('DELETE /users/:id', () => {
	it('should return 204 on successful fetch', async () => {
		const mockDestroy = vi.fn();
		vi.mocked(User.findByPk).mockResolvedValue({
			destroy: mockDestroy,
		} as unknown as Model);

		const response = await DELETE({ params: { id: uuidv4() } });

		expect(response.status).toBe(204);
		expect(mockDestroy).toHaveBeenCalled();
	});
	it('should return 404 when user is not found', async () => {
		vi.mocked(User.findByPk).mockResolvedValue(null);

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
