import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function findOrCreateUser(userName: string) {
		try {
			const response = await fetch('/api/user/find-or-create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: userName }),
			});
			if (!response.ok) {
				throw new Error('Failed to add/find user');
			}
			const data = await response.json();
			if (data.created) {
				update((users) => [data.user, ...users]);
			}
			return data.user;
		} catch (error) {
			console.error('Failed to add user:', error);
		}
	}

	async function deleteUserFromDatabase(id: string) {
		try {
			const response = await fetch(`/api/user/delete/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete user');
			update((users) => users.filter((user) => user.id !== id));
		} catch (error) {
			console.error('Failed to delete user:', error);
		}
	}

	return {
		subscribe,
		set,
		update,
		findOrCreateUser,
		delete: deleteUserFromDatabase,
	};
}

export const userStore = createUserStore();
