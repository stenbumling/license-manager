import type { User } from '$lib/stores/user-store';
import { get, writable } from 'svelte/store';
import { activeFilter, searchQuery, sortState, table, tableData } from './table-store';

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
	cost: string;
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
			const newLicense = await response.json();
			update((allLicenses) => [newLicense, ...allLicenses]);
			tableData.update((allLicenses) => [newLicense, ...allLicenses]);
			updateLicenseCounts();
			await table.applyFilter(get(activeFilter));
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
			await table.applyFilter(
				get(activeFilter),
				get(searchQuery),
				get(sortState).column,
				get(sortState).order,
			);
			update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === license.id ? license : currentLicense,
				),
			);
			tableData.update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === license.id ? license : currentLicense,
				),
			);
			updateLicenseCounts();
			await table.applyFilter(get(activeFilter));
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
			await table.applyFilter(
				get(activeFilter),
				get(searchQuery),
				get(sortState).column,
				get(sortState).order,
			);
			update((allLicenses) => allLicenses.filter((license) => license.id !== id));
			tableData.update((allLicenses) => allLicenses.filter((license) => license.id !== id));
			updateLicenseCounts();
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
