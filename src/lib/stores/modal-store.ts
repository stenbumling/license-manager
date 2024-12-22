import { goto } from '$app/navigation';
import { contextMenu } from '$lib/stores/context-menu-store';
import { licenseFetchRequest, request } from '$lib/stores/request-state-store';
import { applicationStore, applicationToDelete } from '$lib/stores/resources/application-store';
import { licenseMode, licenseStore, licenseToDelete } from '$lib/stores/resources/license-store';
import type { ApplicationModalMode } from '$lib/types/application-types';
import type { LicenseModalMode } from '$lib/types/license-types';
import type { WarningModalMode } from '$lib/types/misc-types';
import { writable } from 'svelte/store';

// Stores the state of the modals in the application
export const showLicenseModal = writable(false);
export const showAssignedUsersModal = writable(false);
export const applicationModalView = writable<ApplicationModalMode>('closed');
export const warningModal = writable<WarningModalMode>('closed');

function createModalController() {
	function validateLicenseId(uuid: string) {
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		return regex.test(uuid);
	}

	async function handleBrowserHistoryChange() {
		const url = new URL(window.location.href);
		const mode = url.searchParams.get('modal') as LicenseModalMode;
		const licenseId = url.searchParams.get('id');

		closeAllModals();

		if (mode === 'add' && !licenseId) {
			licenseMode.set(mode);
			showLicenseModal.set(true);
		} else if (mode === 'view' && licenseId && validateLicenseId(licenseId)) {
			licenseMode.set(mode);
			await licenseStore.fetch(licenseId);
			showLicenseModal.set(true);
		} else if (url.searchParams.size > 0) {
			await goto('/');
		} else if (url.searchParams.size === 0) {
			licenseStore.resetFields();
		}
	}

	async function openViewLicense(licenseId: string) {
		if (validateLicenseId(licenseId)) {
			await goto(`?modal=view&id=${licenseId}`);
			licenseMode.set('view');
			showLicenseModal.set(true);
			await licenseStore.fetch(licenseId);
		} else {
			await goto('/');
			closeAllModals();
		}
	}

	async function openAddLicense() {
		request.setError(licenseFetchRequest, null);
		await goto(`?modal=add`);
		licenseMode.set('add');
		showLicenseModal.set(true);
	}

	async function closeLicense() {
		await goto('/');
		closeAllModals();
		licenseStore.resetFields();
	}

	function closeApplicationModal() {
		applicationModalView.set('closed');
		applicationToDelete.set(null);
		applicationStore.resetFields();
	}

	function closeAssignedUsers() {
		showAssignedUsersModal.set(false);
	}

	function closeWarningModal() {
		licenseToDelete.set(null);
		warningModal.set('closed');
	}

	function closeAllModals() {
		contextMenu.close();
		closeApplicationModal();
		closeAssignedUsers();
		closeWarningModal();
		showLicenseModal.set(false);
	}

	return {
		openViewLicense,
		openAddLicense,
		closeLicense,
		closeApplication: closeApplicationModal,
		closeAssignedUsers,
		handleBrowserHistoryChange,
	};
}

export const modal = createModalController();
