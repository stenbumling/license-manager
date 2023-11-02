import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function addUserToTable(user: User) {
		try {
			const response = await fetch('/api/user/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(user),
			});
			const newUser = await response.json();
			update((users) => [newUser, ...users]);
			return newUser;
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
		add: addUserToTable,
		delete: deleteUserFromDatabase,
	};
}

export const userStore = createUserStore();
