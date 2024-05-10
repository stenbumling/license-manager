import {
	getApplicationDefaultValues,
	type Application,
} from '$lib/stores/resources/application-store';
import type { User } from '$lib/stores/resources/user-store';
import { licenseValidationErrors } from '$lib/validations/license-validation';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { notifications } from '../notification-store';
import {
	disableButtonsDuringRequests,
	licenseDeleteRequest,
	licenseFetchRequest,
	licensePostRequest,
	request,
} from '../request-state-store';

export function getLicenseDefaultValues() {
	return {
		id: uuidv4(),
		application: getApplicationDefaultValues(),
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
		updatedAt: '',
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
	applicationId: string;
	expirationDate: string;
	autoRenewal: boolean;
	cost: number;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
	updatedAt: string;
	users: User[];
	application: Application;
}

export interface LicenseCounts {
	all: number;
	inUse: number;
	unassigned: number;
	nearExpiration: number;
	expired: number;
}

export const currentLicense = writable<License>(getLicenseDefaultValues());
export const fetchedLicense = writable<License | null>(null);
export const licenseMode = writable<'add' | 'view'>('add');
export const licenseCounts = writable<LicenseCounts>(initialLicenseCounts);

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function getLicenseById(id: string) {
		try {
			await request.startLoading(licenseFetchRequest);
			const response = await fetch(`/api/licenses/${id}`);
			await request.endLoading(licenseFetchRequest, 1000);
			if (response.ok) {
				const license = await response.json();
				currentLicense.set(license);
				fetchedLicense.set(JSON.parse(JSON.stringify(license)));
			} else {
				const error: App.Error = await response.json();
				request.setError(licenseFetchRequest, error);
				console.error('Failed to fetch license:', error);
			}
		} catch (error) {
			await request.endLoading(licenseFetchRequest);
			request.setError(licenseFetchRequest, {
				status: 500,
				type: 'Internal Server Error',
				message: 'Failed to fetch license due to a server error.',
				details: 'Please try refreshing the page. If the problem persists, contact support.',
			});
			console.error('Failed to fetch license:', error);
		}
	}

	async function updateLicenseCounts() {
		try {
			const response = await fetch('/api/licenses/counts');
			if (response.ok) {
				const counts = await response.json();
				licenseCounts.set(counts);
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to update license counts:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license counts could not be updated. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to update license counts:', error);
		}
	}

	async function addLicense(license: License) {
		try {
			disableButtonsDuringRequests.set(true);
			await request.startLoading(licensePostRequest, 0);
			const response = await fetch('/api/licenses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			await request.endLoading(licensePostRequest, 1000);
			disableButtonsDuringRequests.set(false);
			if (response.ok) {
				notifications.add({
					message: 'License added successfully',
					type: 'success',
				});
				return true;
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to add license:', error);
				return false;
			}
		} catch (error) {
			await request.endLoading(licensePostRequest);
			disableButtonsDuringRequests.set(false);
			notifications.add({
				message:
					'A server error has occured and license could not be added. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to add license:', error);
			return false;
		}
	}

	async function updateLicense(updatedLicense: License) {
		const currentLicense = get(licenseStore).find((l) => l.id === updatedLicense.id);
		try {
			disableButtonsDuringRequests.set(true);
			await request.startLoading(licensePostRequest, 0);
			const response = await fetch(`/api/licenses/${updatedLicense.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					updatedLicense: updatedLicense,
					currentLicense: currentLicense,
				}),
			});
			await request.endLoading(licensePostRequest, 1000);
			disableButtonsDuringRequests.set(false);
			if (response.ok) {
				notifications.add({
					message: 'License updated successfully',
					type: 'success',
				});
				return true;
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to update license:', error);
				return false;
			}
		} catch (error) {
			await request.endLoading(licensePostRequest);
			disableButtonsDuringRequests.set(false);
			notifications.add({
				message:
					'A server error has occured and license could not be updated. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to update license:', error);
			return false;
		}
	}

	async function deleteLicense(id: string) {
		try {
			disableButtonsDuringRequests.set(true);
			await request.startLoading(licenseDeleteRequest, 0);
			const response = await fetch(`/api/licenses/${id}`, {
				method: 'DELETE',
			});
			await request.endLoading(licenseDeleteRequest, 1000);
			disableButtonsDuringRequests.set(false);
			if (response.ok) {
				notifications.add({
					message: 'License deleted successfully',
					type: 'success',
				});
				return true;
			} else {
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
				console.error('Failed to delete license:', error);
				return false;
			}
		} catch (error) {
			await request.endLoading(licenseDeleteRequest);
			disableButtonsDuringRequests.set(false);
			notifications.add({
				message:
					'A server error has occured and license could not be deleted. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to delete license:', error);
			return false;
		}
	}

	/**
	 * Reset the license store to its initial values.
	 * `setTimeout` is used to wait for the closing animation to finish
	 */
	function resetFields() {
		setTimeout(() => {
			currentLicense.set(getLicenseDefaultValues());
			licenseValidationErrors.set({});
		}, 120);
	}

	return {
		subscribe,
		set,
		update,
		fetch: getLicenseById,
		add: addLicense,
		delete: deleteLicense,
		updateLicense: updateLicense,
		updateCounts: updateLicenseCounts,
		resetFields,
	};
}

export const licenseStore = createLicenseStore();
