import { applicationValidationError } from '$lib/validations/application-validation';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
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
			const response = await fetch('/api/applications');
			if (response.ok) {
				const applications = await response.json();
				set(applications);
			} else {
				const error: App.Error = await response.json();
				request.setError(applicationFetchRequest, error);
				console.error('Failed to fetch applications:', error);
			}
		} catch (error) {
			request.setError(applicationFetchRequest, {
				status: 500,
				type: 'Internal Server Error',
				message: 'Failed to fetch applications due to a server error.',
				details: 'Please try refreshing the page. If the problem persists, contact support.',
			});
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
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
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
			const response = await fetch(`/api/applications/${application.id}`, {
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
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
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
				const error: App.Error = await response.json();
				notifications.add({
					message: error.message,
					type: 'alert',
				});
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
		// Reset after closing animation is done
		setTimeout(() => {
			application.set(getInitialValues());
			applicationValidationError.set({});
		}, 120);
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
