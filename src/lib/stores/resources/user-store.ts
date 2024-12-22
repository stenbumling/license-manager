import { notifications } from '$lib/stores/notification-store';
import { request, userFetchRequest } from '$lib/stores/request-state-store';
import { currentLicense } from '$lib/stores/resources/license-store';
import type { UserData } from '$lib/types/user-types';
import { userValidationErrors, validateUser } from '$lib/validations/user-validation';
import { get, writable } from 'svelte/store';

/** Stores the search query from the user search input field*/
export const userSearchInput = writable<string>('');
/** Stores suggested users based on the search query */
export const userSuggestions = writable<UserData[]>();

function createUserStore() {
	const { subscribe, set, update } = writable<UserData[]>([]);

	async function fetchUsers() {
		try {
			await request.startLoading(userFetchRequest, 600);
			const response = await fetch('/api/users');
			await request.endLoading(userFetchRequest, 1000);
			if (response.ok) {
				const users: UserData[] = await response.json();
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

	async function handleAssignUser(assignedUsername: string) {
		const userWithLowerCase = assignedUsername.trim().toLowerCase();
		const isValid = await validateUser(userWithLowerCase);
		const userToAssign = get(userStore).find(
			(user) => user.name.trim().toLowerCase() === userWithLowerCase,
		);
		const userAlreadyAssigned = get(currentLicense).users.find((u) => u.id === userToAssign?.id);

		if (!isValid) {
			return;
		} else if (!userToAssign) {
			userValidationErrors.set(['User does not exist']);
		} else if (userAlreadyAssigned) {
			userValidationErrors.set(['User is already assigned']);
			userSearchInput.set('');
		} else {
			currentLicense.update((license) => {
				const newUsers = [...license.users, userToAssign];
				return { ...license, users: newUsers };
			});
			updateUserSuggestions('');
			userSearchInput.set('');
		}
	}

	async function handleUnassignUser(user: UserData) {
		currentLicense.update((license) => {
			const newUsers = license.users.filter((u) => u.id !== user.id);
			return { ...license, users: newUsers };
		});
		userStore.updateUserSuggestions('');
	}

	function updateUserSuggestions(input: string) {
		const trimmedInput = input.trim().toLowerCase();
		userSuggestions.set(
			get(userStore).filter((user) => {
				const userName = user.name.toLowerCase();
				const isAssigned = get(currentLicense).users.some((u) => u.id === user.id);
				const isInactive = user.active === false;
				return userName.includes(trimmedInput) && !isAssigned && !isInactive;
			}),
		);
	}

	return {
		subscribe,
		set,
		update,
		fetch: fetchUsers,
		assignUser: handleAssignUser,
		unassignUser: handleUnassignUser,
		updateUserSuggestions,
	};
}

export const userStore = createUserStore();
