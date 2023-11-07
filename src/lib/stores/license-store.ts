import type { User } from '$lib/stores/user-store';
import { get, writable } from 'svelte/store';

export function getInitialValues() {
	return {
		id: 'temp-id',
		application: {
			id: '',
			name: '',
		},
		applicationId: '',
		users: [],
		renewalDate: '',
		autoRenewal: false,
		cost: '',
		renewalInterval: '',
		category: '',
		status: '',
		contactPerson: '',
		additionalContactInfo: '',
		comment: '',
	};
}

export interface License {
	id: string;
	application: {
		id: string;
		name: string;
	};
	applicationId: string;
	users: User[];
	renewalDate: string;
	autoRenewal: boolean;
	cost: string;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
}

export const licenseMode = writable<'add' | 'edit'>('add');
export const license = writable<License>(getInitialValues());

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function fetchLicenses() {
		try {
			const response = await fetch('/api/license');
			const licenses = await response.json();
			set(licenses);
		} catch (error) {
			console.error('Failed to fetch licenses:', error);
		}
	}

	function getLicenseById(id: string) {
		const fetchedLicense = get(licenseStore).find((license) => license.id === id);

		if (fetchedLicense) {
			license.set(structuredClone(fetchedLicense));
		} else {
			console.error('Failed to get license from store');
		}
	}

	async function addLicense(license: License) {
		try {
			const response = await fetch('/api/license/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			const newLicense = await response.json();
			update((allLicenses) => [newLicense, ...allLicenses]);
		} catch (error) {
			console.error('Failed to add license:', error);
		}
	}

	async function updateLicense(license: License) {
		try {
			const response = await fetch(`/api/license/update/${license.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			if (!response.ok) throw new Error('Failed to update license');
			update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === license.id ? license : currentLicense,
				),
			);
		} catch (error) {
			console.error('Failed to update license:', error);
		}
	}


	async function deleteLicense(id: string) {
		try {
			const response = await fetch(`/api/license/delete/${id}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to delete license');
			update((allLicenses) => allLicenses.filter((license) => license.id !== id));
		} catch (error) {
			console.error('Failed to delete license:', error);
		}
	}

	return {
		subscribe,
		set,
		update,
		fetchAll: fetchLicenses,
		fetch: getLicenseById,
		add: addLicense,
		delete: deleteLicense,
		updateLicense: updateLicense,
		resetFields: () => license.set(getInitialValues()),
	};
}

export const licenseStore = createLicenseStore();
