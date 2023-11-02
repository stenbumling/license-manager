import { writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
}

export const usersToRemove = writable<User[]>([]);
export const usersToAdd = writable<User[]>([]);

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function addUser(user: User) {
		try {
			const response = await fetch('/api/user/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(user),
			});
			const newUser = await response.json();
			update((users) => [newUser, ...users]);
		} catch (error) {
			console.error('Failed to add user:', error);
		}
	}

	async function deleteUser(id: string) {
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
		add: addUser,
		delete: deleteUser,
	};
}

export const userStore = createUserStore();
