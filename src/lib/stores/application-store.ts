// src/stores/licenseStore.js
import { writable } from 'svelte/store';

export interface Application {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

function createApplicationStore() {
	const { subscribe, set, update } = writable<Application[]>([]);

	async function addApplication(applicationName: string) {
		try {
			const response = await fetch('/api/application/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: applicationName }),
			});
			const newApplication = await response.json();
			update((applications) => [...applications, newApplication]);
		} catch (error) {
			console.error('Failed to add application:', error);
		}
	}

	async function deleteApplication(id: number) {
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
	};
}

export const applicationStore = createApplicationStore();
