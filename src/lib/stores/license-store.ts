import { applicationStore, type Application } from '$lib/stores/application-store';
import type { User } from '$lib/stores/user-store';
import { delay } from '$lib/utils/delay';
import { licenseValidationErrors } from '$lib/validations/license-validation';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { licenseFetchRequest, loadingState } from './loading-store';
import { table } from './table-store';

function getInitialValues() {
	return {
		id: uuidv4(),
		application: {
			id: uuidv4(),
			name: '',
			licenseAssociations: 0,
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
	application: Application;
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

export const license = writable<License>(getInitialValues());
export const licenseMode = writable<'add' | 'view'>('add');
export const licenseCounts = writable<LicenseCounts>(initialLicenseCounts);
export const licenseFetchError = writable('');
export const licensePostError = writable('');

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
		licenseFetchError.set('');
		loadingState.start(licenseFetchRequest, 0);
		try {
			await delay(1000);
			const response = await fetch(`/api/licenses/${id}`);
			if (response.ok) {
				const fetchedLicense = await response.json();
				license.set(fetchedLicense);
			} else {
				const errorMessage = await response.json();
				licenseFetchError.set(errorMessage);
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
			licenseFetchError.set((error as Error).message);
			console.error('Failed to fetch license:', (error as Error).message);
			// toast
		} finally {
			loadingState.end(licenseFetchRequest);
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
				await updateLicenseCounts();
				await applicationStore.updateAssociations(license.applicationId, 'add');
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
				const currentLicense = get(licenseStore).find((l) => l.id === license.id);
				if (currentLicense) {
					if (currentLicense.applicationId !== license.applicationId) {
						await applicationStore.updateAssociations(currentLicense.applicationId, 'remove');
						await applicationStore.updateAssociations(license.applicationId, 'add');
					}
				}
				await updateLicenseCounts();
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

	async function deleteLicense(id: string, applicationId: string) {
		try {
			const response = await fetch(`/api/licenses/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				await updateLicenseCounts();
				await applicationStore.updateAssociations(applicationId, 'remove');
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
		licenseValidationErrors.set({});
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
