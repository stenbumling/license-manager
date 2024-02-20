import { type Application } from '$lib/stores/resources/application-store';
import type { User } from '$lib/stores/resources/user-store';
import { licenseValidationErrors } from '$lib/validations/license-validation';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { serverBaseUrl } from '../../../config/server-base-url';
import { notifications } from '../notification-store';
import { licenseFetchRequest, licensePostRequest, request } from '../request-state-store';
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

function createLicenseStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	async function getLicenseById(id: string) {
		request.startLoading(licenseFetchRequest);
		try {
			const response = await fetch(`${serverBaseUrl}/api/licenses/${id}`);
			if (response.ok) {
				const fetchedLicense = await response.json();
				license.set(fetchedLicense);
			} else {
				const error = await response.json();
				if (response.status === 404) {
					request.setError(
						licenseFetchRequest,
						response.status,
						error.error || 'Not found',
						error.message || 'Failed to fetch license',
					);
				} else {
					request.setError(
						licenseFetchRequest,
						response.status,
						error.error || 'Internal Server Error',
						error.message || 'Failed to fetch license',
					);
				}
				console.error('Failed to fetch license:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license could not be fetched. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			request.setError(
				licenseFetchRequest,
				500,
				'Internal Server Error',
				'Failed to fetch license',
			);
			console.error('Failed to fetch license:', error);
		} finally {
			request.endLoading(licenseFetchRequest);
		}
	}

	async function updateLicenseCounts() {
		try {
			const response = await fetch(`${serverBaseUrl}/api/licenses/counts`);
			if (response.ok) {
				const counts = await response.json();
				licenseCounts.set(counts);
			} else {
				const error = await response.json();
				notifications.add({
					message: error.message || 'An error has occured. Please try refreshing the page.',
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
		request.startLoading(licensePostRequest);
		try {
			const response = await fetch(`${serverBaseUrl}/api/licenses`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(license),
			});
			if (response.ok) {
				await updateLicenseCounts();
				await table.updateState();
				notifications.add({
					message: 'License created successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				notifications.add({
					message: error.message || 'Failed to create license. Please try again.',
					type: 'alert',
				});
				console.error('Failed to create license:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license could not be created. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to create license:', error);
		} finally {
			request.endLoading(licensePostRequest);
		}
	}

	async function updateLicense(updatedLicense: License) {
		request.startLoading(licensePostRequest);
		const currentLicense = get(licenseStore).find((l) => l.id === updatedLicense.id);
		try {
			const response = await fetch(`${serverBaseUrl}/api/licenses/${updatedLicense.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					updatedLicense: updatedLicense,
					currentLicense: currentLicense,
				}),
			});
			if (response.ok) {
				await updateLicenseCounts();
				await table.updateState();
				notifications.add({
					message: 'License updated successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				if (response.status === 409) {
					notifications.add({
						message:
							error.message ||
							'Failed to updated license because of data conflict. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to update license. Please try again.',
						type: 'alert',
					});
				}
				console.error('Failed to update license:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license could not be updated. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to update license:', error);
		} finally {
			request.endLoading(licensePostRequest);
		}
	}

	async function deleteLicense(id: string) {
		try {
			const response = await fetch(`${serverBaseUrl}/api/licenses/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				await updateLicenseCounts();
				await table.updateState();
				notifications.add({
					message: 'License deleted successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				if (response.status === 404) {
					notifications.add({
						message:
							error.message ||
							'Failed to delete license because it could not be found. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to delete license. Please try again.',
						type: 'alert',
					});
				}
				console.error('Failed to delete license:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license could not be deleted. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to delete license:', error);
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
		fetch: getLicenseById,
		add: addLicense,
		delete: deleteLicense,
		updateLicense: updateLicense,
		resetFields: resetFields,
	};
}

export const licenseStore = createLicenseStore();
