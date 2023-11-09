import type { User } from '$lib/stores/user-store';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { table, tableState } from './table-store';

export const licenseSchema = z.object({
	applicationId: z.string().uuid(),
	renewalDate: z.coerce.date(),
	autoRenewal: z.boolean(),
	cost: z.string(), // change to number
	renewalInterval: z.string(),
	category: z.string(),
	status: z.string(),
	contactPerson: z.string(),
	additionalContactInfo: z.string(),
	comment: z.string(),
});

export function getInitialValues() {
	return {
		id: uuidv4(),
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
	cost: string;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
}

interface LicenseErrors {
	applicationId?: { message: string };
	renewalDate?: { message: string };
	autoRenewal?: { message: string };
	cost?: { message: string };
	renewalInterval?: { message: string };
	category?: { message: string };
	status?: { message: string };
	contactPerson?: { message: string };
	additionalContactInfo?: { message: string };
	comment?: { message: string };
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
export const licenseErrors = writable<LicenseErrors>({});
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
			tableState.update((allLicenses) => [newLicense, ...allLicenses]);
			updateLicenseCounts();
			table.updateState();
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
			tableState.update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === license.id ? license : currentLicense,
				),
			);
			updateLicenseCounts();
			table.updateState();
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
			tableState.update((allLicenses) => allLicenses.filter((license) => license.id !== id));
			updateLicenseCounts();
			table.updateState();
		} catch (error) {
			console.error('Failed to delete license:', error);
		}
	}

	async function validateLicense(license: License): Promise<boolean> {
		try {
			licenseSchema.parse(license);
			licenseErrors.set({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors: Record<string, any> = {};

				for (const issue of error.issues) {
					const { path, message } = issue;
					const key = path[0]

					if (!errors[key]) {
						errors[key] = { message: message };
					}
				}
				licenseErrors.set(errors);
				console.log(errors)
				return false;
			} else {
				console.error('Unexpected error when validating license:', error);
				return false;
			}
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
		validate: validateLicense,
		resetFields: () => license.set(getInitialValues()),
	};
}

export const licenseStore = createLicenseStore();
