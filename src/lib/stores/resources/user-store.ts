import { writable } from 'svelte/store';
import { notifications } from '../notification-store';

export interface User {
	id: string;
	name: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function fetchUsers() {
		try {
			const response = await fetch('/api/users');
			if (response.ok) {
				const users = await response.json();
				update(() => users);
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to fetch users:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and users could not be fetched. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to fetch users:', error);
		}
	}

	async function findOrCreateUser(userName: string) {
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
					notifications.add({
						message: `User '${userName}' was successfully added to the database`,
						type: 'success',
					});
				}
				return data.user;
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to find or create user:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and user could not be found or created. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to find or create user:', error);
		}
	}

	// Currently not used, but can be used in future user management features
	async function deleteUserFromDatabase(id: string) {
		try {
			const response = await fetch(`/api/users/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				update((users) => users.filter((user) => user.id !== id));
				notifications.add({
					message: 'User deleted successfully',
					type: 'success',
				});
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to delete user:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and user could not be deleted. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to delete user:', error);
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
