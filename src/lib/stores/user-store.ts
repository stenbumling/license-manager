import { writable } from 'svelte/store';
import { request, userFetchRequest } from './request-state-store';

export interface User {
	id: string;
	name: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function fetchUsers() {
		try {
			const response = await fetch('/api/users');
			if (response.ok && response.status !== 204) {
				const users = await response.json();
				update(() => users);
			} else if (response.status === 204) {
				update(() => []);
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to fetch users:', error);
			// toast
		}
	}

	async function findOrCreateUser(userName: string) {
		request.startLoading(userFetchRequest);
		try {
			const response = await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: userName }),
			});
			if (response.ok) {
				const data = await response.json();
				if (data.created) {
					update((users) => [data.user, ...users]);
				}
				return data.user;
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to add user:\n', error);
			// toast
		} finally {
			request.endLoading(userFetchRequest);
		}
	}

	async function deleteUserFromDatabase(id: string) {
		try {
			const response = await fetch(`/api/users/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				update((users) => users.filter((user) => user.id !== id));
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to delete user:', error);
			// toast
		}
	}

	return {
		subscribe,
		set,
		update,
		fetch: fetchUsers,
		findOrCreateUser,
		delete: deleteUserFromDatabase,
	};
}

export const userStore = createUserStore();
