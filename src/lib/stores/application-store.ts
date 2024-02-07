import { applicationValidationError } from '$lib/validations/application-validation';
import { get, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { notifications } from './notification-store';
import { applicationFetchRequest, request } from './request-state-store';

function getInitialValues() {
	return {
		id: uuidv4(),
		name: '',
		licenseAssociations: 0,
	};
}

export interface Application {
	id: string;
	name: string;
	licenseAssociations: number;
}

export const application = writable<Application>(getInitialValues());

function createApplicationStore() {
	const { subscribe, set, update } = writable<Application[]>([]);

	async function fetchApplications() {
		request.startLoading(applicationFetchRequest);
		try {
			const response = await fetch('/api/applications');
			if (response.ok) {
				const applications = await response.json();
				set(applications);
			} else {
				const error = await response.json();
				notifications.add({
					message: error.message || 'An error has occured. Please try refreshing the page.',
					type: 'alert',
				});
				request.setError(
					applicationFetchRequest,
					response.status,
					error.error || 'Internal Server Error',
					error.message || 'Failed to fetch applications',
				);
				console.error('Failed to fetch applications:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and applications could not be fetched. Please try refreshing the page.',
				type: 'alert',
			});
			request.setError(
				applicationFetchRequest,
				500,
				'Internal Server Error',
				'Failed to fetch applications',
			);
			console.error('Failed to fetch applications:', error);
		} finally {
			request.endLoading(applicationFetchRequest);
		}
	}

	async function addApplication(application: Application) {
		try {
			const response = await fetch('/api/applications', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(application),
			});
			if (response.ok) {
				await fetchApplications();
				notifications.add({
					message: 'Application created successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				notifications.add({
					message: error.message || 'Failed to create application. Please try again.',
					type: 'alert',
				});
				console.error('Failed to create application:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and application could not be created. Please try refreshing the page.',
				type: 'alert',
			});
			console.error('Failed to create application:', error);
		}
	}

	async function deleteApplication(id: string) {
		try {
			const response = await fetch(`/api/applications/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				await fetchApplications();
				notifications.add({
					message: 'Application deleted successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				if (response.status === 404) {
					notifications.add({
						message:
							error.message ||
							'Failed to delete application because it could not be found. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else if (response.status === 409) {
					notifications.add({
						message:
							error.message ||
							'Failed to delete application because of data conflict. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to delete application. Please try again.',
						type: 'alert',
					});
				}
				console.error('Failed to delete application:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and application could not be deleted. Please try refreshing the page.',
				type: 'alert',
			});
			console.error('Failed to delete application:', error);
		}
	}

	/*
	 * TODO: Consider moving this functionality to server side when adding, deleting
	 * or updating license. There's a risk of associations data becoming out of sync
	 * with the actual license data.
	 */
	async function updateLicenseAssociations(id: string, action: 'add' | 'remove') {
		try {
			// decide whether to add or remove a license association
			const app = get(applicationStore).find((a) => a.id === id);
			if (app) {
				if (action === 'add') {
					app.licenseAssociations++;
				} else if (action === 'remove') {
					app.licenseAssociations--;
				}
			}
			const response = await fetch(`/api/applications/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(app),
			});
			if (response.ok) {
				await fetchApplications();
			} else {
				const error = await response.json();
				if (response.status === 409) {
					notifications.add({
						message:
							error.message ||
							'Failed to updated license associations because of data conflict. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to update license associations. Please try again.',
						type: 'alert',
					});
				}
				console.error('Failed to update license associations:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and license associations could not be updated. Please try refreshing the page.',
				type: 'alert',
			});
			console.error('Failed to update license associations:', error);
		}
	}

	function resetField() {
		application.set(getInitialValues());
		applicationValidationError.set({});
	}

	return {
		subscribe,
		set,
		update,
		fetch: fetchApplications,
		add: addApplication,
		delete: deleteApplication,
		updateAssociations: updateLicenseAssociations,
		reset: resetField,
	};
}

export const applicationStore = createApplicationStore();
