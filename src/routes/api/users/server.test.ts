import User from '$lib/server/models/user-model';
import { describe, expect, it, vi } from 'vitest';
import { GET } from './+server';

describe('GET /users', () => {
	it('should return 200 on successful fetch', async () => {
		vi.mocked(User.findAll).mockResolvedValue([]);

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});
});