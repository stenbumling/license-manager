import { applicationErrors } from '$lib/validations/application-validation';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export function getInitialValues() {
	return {
		id: uuidv4(),
		name: '',
	};
}

export interface Application {
	id: string;
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
			update((applications) => [newApplication, ...applications]);
		} catch (error) {
			console.error('Failed to add application:', error);
		}
	}

	async function deleteApplication(id: string) {
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

	function resetField() {
		application.set(getInitialValues());
		applicationErrors.set({});
	}

	return {
		subscribe,
		set,
		update,
		add: addApplication,
		delete: deleteApplication,
		reset: resetField,
	};
}

export const applicationStore = createApplicationStore();
