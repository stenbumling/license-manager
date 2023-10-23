import { writable } from 'svelte/store';

export function getInitialValues() {
	return {
		id: null,
		name: '',
	};
}

export interface Application {
	id: number | null;
	name: string;
}

export const application = writable<Application>(getInitialValues());

function createApplicationStore() {
	const { subscribe, set, update } = writable<Application[]>([]);

	async function addApplication(application: Application) {
		try {
			const response = await fetch('/api/application/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(application),
			});
			const newApplication = await response.json();
			update((applications) => [...applications, newApplication]);
		} catch (error) {
			console.error('Failed to add application:', error);
		}
	}

	async function deleteApplication(id: number | null) {
		try {
			const response = await fetch(`/api/application/delete/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete application');
			update((applications) => applications.filter((application) => application.id !== id));
		} catch (error) {
			console.error('Failed to delete application:', error);
		}
	}

	return {
		subscribe,
		set,
		update,
		add: addApplication,
		delete: deleteApplication,
		reset: () => application.set(getInitialValues()),
	};
}

export const applicationStore = createApplicationStore();
