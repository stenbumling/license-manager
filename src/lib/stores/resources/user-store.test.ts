import { HttpResponse, http } from 'msw';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { serverBaseUrl } from '../../../config/server-base-url';
import { fetchedUsers, foundUser } from '../../../mocks/data/user';
import { server } from '../../../mocks/setup/node';
import { triggerMockError } from '../../../mocks/utils/handler-helpers';
import { userStore } from './user-store';

describe('User Store', () => {
	describe('fetchUsers', () => {
		it('should fetch users from the server and update the store', async () => {
			await userStore.fetch();

			const users = get(userStore);
			expect(users.length).toBe(5);
			expect(users[3].name).toBe('Daniel');
		});
		it('should not update store if a server request fails', async () => {
			server.use(
				http.get(`${serverBaseUrl}/api/users`, () => {
					return triggerMockError();
				}),
			);

			await userStore.fetch();

			const users = get(userStore);
			expect(users.length).toBe(0);
		});
	});

	describe('findOrCreateUser', () => {
		it('should successfully create a new user to the server and update the store', async () => {
			await userStore.findOrCreateUser('Namn Namnsson');
			const users = get(userStore);

			expect(users.some((user) => user.name === 'Namn Namnsson')).toBe(true);
		});
		it('should successfully find an existing user to the server without creating duplicates', async () => {
			server.use(
				http.post(`${serverBaseUrl}/api/users`, () => {
					return HttpResponse.json(foundUser);
				}),
			);
			userStore.set(fetchedUsers);
			const initialUsers = get(userStore);
			expect(initialUsers.length).toBe(5);

			await userStore.findOrCreateUser('Cecilia');

			const users = get(userStore);
			expect(users.some((user) => user.name === 'Cecilia')).toBe(true);
			expect(users.length).toBe(5);
		});
		it('should not update store if server request fails and display an error message', async () => {
			server.use(
				http.post(`${serverBaseUrl}/api/users`, () => {
					return triggerMockError();
				}),
			);

			await userStore.findOrCreateUser('Felix');

			const users = get(userStore);
			expect(users.length).toBe(0);
		});
	});

	describe('deleteUserFromDatabase', () => {
		it('should successfully delete a user and update the store', async () => {
			userStore.set(fetchedUsers);
			const initialUsers = get(userStore);
			expect(initialUsers.length).toBe(5);

			await userStore.delete('test-id');

			const users = get(userStore);
			expect(users.length).toBe(4);
			expect(users.some((user) => user.id === 'test-id')).toBe(false);
		});
		it('should not update store if server request fails and display an error message', async () => {
			server.use(
				http.delete(`${serverBaseUrl}/api/users/:id`, () => {
					return triggerMockError();
				}),
			);

			userStore.set(fetchedUsers);
			const initialUsers = get(userStore);
			expect(initialUsers.length).toBe(5);

			await userStore.delete('test-id');

			const users = get(userStore);
			expect(users.length).toBe(5);
			expect(users.some((user) => user.id === 'test-id')).toBe(true);
		});
	});
});
