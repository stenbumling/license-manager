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
		renewalDate: '',
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
	renewalDate: string;
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

export const licenseMode = writable<'add' | 'edit'>('add');
export const license = writable<License>(getInitialValues());
export const licenseCounts = writable<LicenseCounts>(initialLicenseCounts);

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function fetchLicenses() {
		try {
			const response = await fetch('/api/license');
			const { licenses } = await response.json();
			if (licenses) {
				set(licenses);
			} else {
				throw new Error(`Licenses could not be fetched`);
			}
		} catch (error) {
			console.error('Failed to fetch licenses:', error);
		}
	}

	async function getLicenseById(id: string) {
		try {
			const response = await fetch(`/api/license/${id}`);
			const fetchedLicense = await response.json();
			if (fetchedLicense) {
				license.set(fetchedLicense);
			} else {
				throw new Error(`License with id ${id} not found`);
			}
		} catch (error) {
			console.error('Failed to fetch license:', error);
		}
	}

	async function updateLicenseCounts() {
		try {
			const response = await fetch('/api/license/counts');
			const counts = await response.json();
			licenseCounts.set(counts);
		} catch (error) {
			console.error('Failed to fetch license counts:', error);
		}
	}

	async function addLicense(license: License) {
		try {
			const response = await fetch('/api/license/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			updateLicenseCounts();
			await table.updateState();
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
			updateLicenseCounts();
			await table.updateState();
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
			updateLicenseCounts();
			await table.updateState();
		} catch (error) {
			console.error('Failed to delete license:', error);
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
