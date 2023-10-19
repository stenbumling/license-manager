import { writable } from 'svelte/store';

export const applicationTitle = writable('New license');

export interface License {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

function createApplicationStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function addLicense(license: License) {
		try {
			const response = await fetch('/api/licenses/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			const newLicense = await response.json();
			update((licenses) => [...licenses, newLicense]);
		} catch (error) {
			console.error('Failed to add license:', error);
		}
	}

	async function deleteLicense(id: number) {
		try {
			const response = await fetch(`/api/license/delete/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete license');
			update((licenses) => licenses.filter((license) => license.id !== id));
		} catch (error) {
			console.error('Failed to delete license:', error);
		}
	}

	return {
		subscribe,
		set,
		update,
		add: addLicense,
		delete: deleteLicense,
	};
}

export const applicationStore = createApplicationStore();
