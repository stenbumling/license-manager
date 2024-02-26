import { applicationValidationError } from '$lib/validations/application-validation';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import { serverBaseUrl } from '../../../config/server-base-url';
import { notifications } from '../notification-store';
import { applicationFetchRequest, request } from '../request-state-store';
import { table } from './table-store';

function getInitialValues() {
	return {
		id: uuidv4(),
		name: '',
		link: '',
		licenseAssociations: 0,
	};
}

export interface Application {
	id: string;
	name: string;
	link: string;
	licenseAssociations: number;
}

export const application = writable<Application>(getInitialValues());

function createApplicationStore() {
	const { subscribe, set, update } = writable<Application[]>([]);

	async function fetchApplications() {
		request.startLoading(applicationFetchRequest);
		try {
			const response = await fetch(`${serverBaseUrl}/api/applications`);
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
				timeout: false,
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
			const response = await fetch(`${serverBaseUrl}/api/applications`, {
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
				timeout: false,
			});
			console.error('Failed to create application:', error);
		}
	}

	async function editApplication(application: Application) {
		try {
			const response = await fetch(`${serverBaseUrl}/api/applications/${application.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(application),
			});
			if (response.ok) {
				await fetchApplications();
				await table.updateState();
				notifications.add({
					message: 'Application was edited successfully',
					type: 'success',
				});
			} else {
				const error = await response.json();
				if (response.status === 409) {
					notifications.add({
						message:
							error.message ||
							'Failed to edit application because of data conflict. Try refreshing the page to get the latest data.',
						type: 'alert',
					});
				} else {
					notifications.add({
						message: error.message || 'Failed to edit application. Please try again.',
						type: 'alert',
					});
				}
				console.error('Failed to edit application:', error);
			}
		} catch (error) {
			notifications.add({
				message:
					'A server error has occured and application could not be edited. Please try refreshing the page.',
				type: 'alert',
				timeout: false,
			});
			console.error('Failed to edit application:', error);
		}
	}

	async function deleteApplication(id: string) {
		try {
			const response = await fetch(`${serverBaseUrl}/api/applications/${id}`, {
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
				timeout: false,
			});
			console.error('Failed to delete application:', error);
		}
	}

	function resetFields() {
		application.set(getInitialValues());
		applicationValidationError.set({});
	}

	return {
		subscribe,
		set,
		update,
		fetch: fetchApplications,
		add: addApplication,
		edit: editApplication,
		delete: deleteApplication,
		reset: resetFields,
	};
}

export const applicationStore = createApplicationStore();
