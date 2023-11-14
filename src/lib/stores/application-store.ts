import { applicationErrors } from '$lib/validations/application-validation';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

function getInitialValues() {
	return {
		id: uuidv4(),
		name: '',
		licenseAssociations: 0,
	};
}

export interface Application {
	id: string;
	name: string;
	licenseAssociations: number;
}

export const application = writable<Application>(getInitialValues());

function createApplicationStore() {
	const { subscribe, set, update } = writable<Application[]>([]);

	async function fetchApplications() {
		try {
			const response = await fetch('/api/applications');
			if (response.ok) {
				const applications = await response.json();
				set(applications);
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

	async function updateLicenseAssociations(id: string, action: 'add' | 'remove') {
		try {
			// decide whether to add or remove a license association
			const app = get(applicationStore).find((a) => a.id === id);
			if (app) {
				if (action === 'add') {
					app.licenseAssociations++;
				} else if (action === 'remove') {
					app.licenseAssociations--;
				}
			}
			const response = await fetch(`/api/applications/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(app),
			});
			if (response.ok) {
				await fetchApplications();
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
			console.error('Failed to update license associations\n:', error);
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
		updateAssociations: updateLicenseAssociations,
		reset: resetField,
	};
}

export const applicationStore = createApplicationStore();
