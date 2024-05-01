import { writable } from 'svelte/store';
import { notifications } from '../notification-store';
import { request, userFetchRequest } from '../request-state-store';

export interface User {
	id: string;
	name: string;
	active: boolean;
}

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	async function fetchUsers() {
		try {
			await request.startLoading(userFetchRequest, 600);
			const response = await fetch('/api/users');
			await request.endLoading(userFetchRequest, 1000);
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
			await request.endLoading(userFetchRequest);
			notifications.add({
				message:
					'A server error has occured and users could not be fetched. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to fetch users:', error);
		}
	}

	return {
		subscribe,
		set,
		update,
		fetch: fetchUsers,
	};
}

export const userStore = createUserStore();
