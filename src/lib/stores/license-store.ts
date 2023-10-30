import { get, writable } from 'svelte/store';

export function getInitialValues() {
	return {
		application: '',
		assignedUsers: '',
		renewalDate: '',
		cost: '',
		renewalInterval: '',
		category: '',
		status: '',
		contactPerson: '',
		additionalContactInfo: '',
		comment: '',
	};
}

export interface NewLicense {
	application: string;
	assignedUsers: string;
	renewalDate: string;
	cost: string;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
}

export interface License extends NewLicense {
	id: string;
}

export const licenseMode = writable<'add' | 'edit'>('add');
export const license = writable<NewLicense | License>(getInitialValues());

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function addLicense(license: NewLicense) {
		try {
			const response = await fetch('/api/license/add', {
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

	async function updateLicense(license: License) {
		try {
			const response = await fetch(`/api/license/update/${license.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			if (!response.ok) throw new Error('Failed to update license');
			update((licenses) =>
				licenses.map((existingLicense) =>
					existingLicense.id === license.id ? license : existingLicense,
				),
			);
		} catch (error) {
			console.error('Failed to update license:', error);
		}
	}

	function getLicenseById(id: string) {
		const licenses = get(licenseStore);
		const fetchedLicense = licenses.find((license) => license.id === id);
		console.log('fetchedLicense: ', fetchedLicense);
		if (fetchedLicense) {
			license.set(fetchedLicense);
		} else {
			console.error('Failed to get license from store');
		}
	}

	async function deleteLicense(id: string) {
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
		update: updateLicense,
		add: addLicense,
		delete: deleteLicense,
		fetch: getLicenseById,
		resetFields: () => license.set(getInitialValues()),
	};
}

export const licenseStore = createLicenseStore();
