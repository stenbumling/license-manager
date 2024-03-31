import { writable } from 'svelte/store';
import { notifications } from '../notification-store';
import { request, userFetchRequest } from '../request-state-store';

export interface User {
	id: string;
	name: string;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	// Currently not used, but can be used in future user management features
	async function fetchUsers() {
		request.startLoading(userFetchRequest);
		try {
			const response = await fetch('$/api/users');
			if (response.ok) {
				const users = await response.json();
				update(() => users);
			} else {
				const error = await response.json();
				notifications.add({
					message: error.message || 'An error has occured. Please try refreshing the page.',
					type: 'alert',
				});
				request.setError(
					userFetchRequest,
					response.status,
					error.error || 'Internal Server Error',
					error.message || 'Failed to fetch users',
				);
				console.error('Failed to fetch users:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and users could not be fetched. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			request.setError(userFetchRequest, 500, 'Internal Server Error', 'Failed to fetch users');
			console.error('Failed to fetch users:', error);
		} finally {
			request.endLoading(userFetchRequest);
		}
	}

	async function findOrCreateUser(userName: string) {
		request.startLoading(userFetchRequest, 500);
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
				const error = await response.json();
				notifications.add({
					message: error.message || 'Failed to find or create user. Please try again.',
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
			request.setError(
				userFetchRequest,
				500,
				'Internal Server Error',
				'Failed to find or create user',
			);
			console.error('Failed to find or create user:', error);
		} finally {
			request.endLoading(userFetchRequest);
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
				const error = await response.json();
				if (response.status === 404) {
					notifications.add({
						message:
							error.message ||
							'Failed to delete user because it could not be found. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to delete user. Please try again.',
						type: 'alert',
					});
				}
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
