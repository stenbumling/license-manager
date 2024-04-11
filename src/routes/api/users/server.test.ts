import User from '$lib/server/models/user-model';
import type { Model } from 'sequelize';
import { describe, expect, it, vi } from 'vitest';
import { GET, POST } from './+server';

describe('GET /users', () => {
	it('should return 200 on successful fetch', async () => {
		vi.mocked(User.findAll).mockResolvedValue([]);

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});
});

describe('POST /users', () => {
	it('should return 201 on successful creation', async () => {
		vi.mocked(User.findOrCreate).mockResolvedValue([
			{ name: 'New test user' } as unknown as Model,
			true,
		]);

		const response = await POST({
			request: {
				json: async () => ({ name: 'New test user' }),
			},
		});
		const body = await response.json();

		expect(response.status).toBe(201);
		expect(body).toEqual({ user: { name: 'New test user' }, created: true });
	});
	it('should return 200 on successful fetch', async () => {
		vi.mocked(User.findOrCreate).mockResolvedValue([
			{ name: 'Found test user' } as unknown as Model,
			false,
		]);

		const response = await POST({
			request: {
				json: async () => ({ name: 'Found test user' }),
			},
		});
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual({ user: { name: 'Found test user' }, created: false });
	});

	it('should return 400 if name is missing', async () => {
		try {
			await POST({
				request: {
					json: async () => ({}),
				},
			});
			expect.fail('Should have thrown an error');
		} catch (error) {
			const typedError = error as {
				status: number;
				body: App.Error;
			};

			expect(typedError.status).toBe(400);
			expect(typedError.body).toHaveProperty('type', 'InvalidRequestError');
		}
	});
});
