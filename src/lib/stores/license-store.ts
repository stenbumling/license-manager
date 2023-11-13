import type { User } from '$lib/stores/user-store';
import { licenseErrors } from '$lib/validations/license-validation';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { table } from './table-store';

export function getInitialValues() {
	return {
		id: uuidv4(),
		application: {
			id: uuidv4(),
			name: '',
		},
		applicationId: '',
		users: [],
		expirationDate: '',
		autoRenewal: false,
		cost: 0,
		renewalInterval: 'None',
		category: 'Uncategorized',
		status: 'Active',
		contactPerson: '',
		additionalContactInfo: '',
		comment: '',
	};
}

const initialLicenseCounts = {
	all: 0,
	inUse: 0,
	unassigned: 0,
	nearExpiration: 0,
	expired: 0,
};

export interface License {
	id: string;
	application: {
		id: string;
		name: string;
	};
	applicationId: string;
	users: User[];
	expirationDate: string;
	autoRenewal: boolean;
	cost: number;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
}

export interface LicenseCounts {
	all: number;
	inUse: number;
	unassigned: number;
	nearExpiration: number;
	expired: number;
}

export const licenseMode = writable<'add' | 'view'>('add');
export const license = writable<License>(getInitialValues());
export const licenseCounts = writable<LicenseCounts>(initialLicenseCounts);

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function fetchLicenses() {
		try {
			const response = await fetch('/api/licenses');
			if (response.ok) {
				const { licenses } = await response.json();
				set(licenses);
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
			console.error('Failed to fetch licenses:', error);
			// toast
		}
	}

	async function getLicenseById(id: string) {
		try {
			const response = await fetch(`/api/licenses/${id}`);
			if (response.ok) {
				const fetchedLicense = await response.json();
				license.set(fetchedLicense);
			} else {
				const errorMessage = await response.json();
				if (response.status === 404) {
					throw new Error(`License with id ${id} not found`);
					// toast
				} else if (response.status === 401) {
					// toast
				} else {
					// toast
				}
				console.error(errorMessage);
			}
		} catch (error) {
			console.error('Failed to fetch license:', (error as Error).message);
			// toast
		}
	}

	async function updateLicenseCounts() {
		try {
			const response = await fetch('/api/licenses/counts');
			if (response.ok) {
				const counts = await response.json();
				licenseCounts.set(counts);
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
			console.error('Failed to fetch license counts:', error);
			// toast
		}
	}

	async function addLicense(license: License) {
		try {
			const response = await fetch('/api/licenses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			if (response.ok) {
				updateLicenseCounts();
				await table.updateState();
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
			console.error('Failed to add license:', error);
			// toast
		}
	}

	async function updateLicense(license: License) {
		try {
			const response = await fetch(`/api/licenses/${license.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			if (response.ok) {
				updateLicenseCounts();
				await table.updateState();
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
			console.error('Failed to update license:', error);
			// toast
		}
	}

	async function deleteLicense(id: string) {
		try {
			const response = await fetch(`/api/licenses/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				updateLicenseCounts();
				await table.updateState();
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
			console.error('Failed to delete license:', error);
			// toast
		}
	}

	function resetFields() {
		license.set(getInitialValues());
		licenseErrors.set({});
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
		resetFields: resetFields,
	};
}

export const licenseStore = createLicenseStore();
