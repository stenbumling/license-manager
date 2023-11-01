import { writable } from 'svelte/store';

export function getInitialValues() {
	return {
		id: '',
		name: '',
	};
}

export interface User {
	id: string;
	name: string;
}

export const user = writable<User>(getInitialValues());

function createUserStore() {
	const { subscribe, set, update } = writable<User[]>([]);

	return {
		subscribe,
		set,
		update,
		reset: () => user.set(getInitialValues()),
	};
}

export const userStore = createUserStore();
