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

	async function fetchApplications() {
		try {
			const response = await fetch('/api/applications');
			if (response.ok) {
				const applications = await response.json();
				update(() => applications);
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to fetch applications\n:', error);
			// toast
		}
	}

	async function addApplication(application: Application) {
		try {
			const response = await fetch('/api/applications', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(application),
			});
			if (response.ok) {
				const newApplication = await response.json();
				update((applications) => [newApplication, ...applications]);
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to add application\n:', error);
			// toast
		}
	}

	async function deleteApplication(id: string) {
		try {
			const response = await fetch(`/api/applications/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				update((applications) => applications.filter((application) => application.id !== id));
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to delete application\n:', error);
			// toast
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
		fetch: fetchApplications,
		add: addApplication,
		delete: deleteApplication,
		reset: resetField,
	};
}

export const applicationStore = createApplicationStore();
