import type { User } from '$lib/stores/user-store';
import { get, writable } from 'svelte/store';

export function getInitialValues() {
	return {
		application: {
			id: '',
			name: '',
		},
		users: [],
		assignedUsers: '',
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

export interface NewLicense {
	application: {
		id: string;
		name: string;
	};
	users: User[];
	assignedUsers: string;
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

	async function assignUserToLicense(licenseId: string, user: User) {
		try {
			const response = await fetch(`/api/license/${licenseId}/assign/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(user),
			});
			if (!response.ok) throw new Error('Failed to assign user to license');
			update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === licenseId
						? { ...currentLicense, users: [...currentLicense.users, user] }
						: currentLicense,
				),
			);
		} catch (error) {
			console.error('Failed to assign user to license:', error);
		}
	}

	async function removeUserFromLicense(licenseId: string, userId: string) {
		try {
			const response = await fetch(`/api/license/${licenseId}/remove/${userId}`, {
				method: 'DELETE',
			});
			if (!response.ok) throw new Error('Failed to remove user from license');
			update((allLicenses) =>
				allLicenses.map((currentLicense) =>
					currentLicense.id === licenseId
						? {
								...currentLicense,
								users: currentLicense.users.filter((user) => user.id !== userId),
						  }
						: currentLicense,
				),
			);
		} catch (error) {
			console.error('Failed to remove user from license:', error);
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
		add: addLicense,
		delete: deleteLicense,
		assignUser: assignUserToLicense,
		removeUser: removeUserFromLicense,
		fetch: getLicenseById,
		updateLicense: updateLicense,
		resetFields: () => license.set(getInitialValues()),
	};
}

export const licenseStore = createLicenseStore();
