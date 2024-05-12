import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it, vi } from 'vitest';
import { GET, POST } from './+server';
import ApplicationModel from '$lib/server/models/application-model';

describe('GET /applications/', () => {
	vi.mocked(ApplicationModel.findAll).mockResolvedValue([]);

	it('should return 200 and fetched data on successful fetch', async () => {
		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});
});

describe('POST /applications/', () => {
	vi.mocked(ApplicationModel.create).mockResolvedValue({
		dataValues: {
			id: uuidv4(),
			licenseAssociations: 0,
			name: 'Test application',
		},
	});

	it('should return 201 and created data on successful creation', async () => {
		const response = await POST({
			request: {
				json: async () => ({ name: 'Test application' }),
			},
		});
		const body = await response.json();
		expect(response.status).toBe(201);
		expect(body).toHaveProperty('name', 'Test application');
		expect(body).toHaveProperty('licenseAssociations', 0);
	});

	it('should throw an error when application name is missing', async () => {
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
			expect(typedError.body).toHaveProperty('type', 'DataCreationError');
		}
	});
});
