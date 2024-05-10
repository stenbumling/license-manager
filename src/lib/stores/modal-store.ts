import { goto } from '$app/navigation';
import type { ApplicationModalMode } from '$lib/types/application-types';
import type { LicenseModalMode } from '$lib/types/license-types';
import { writable } from 'svelte/store';
import { contextMenu } from './context-menu-store';
import { licenseFetchRequest, request } from './request-state-store';
import { applicationStore } from './resources/application-store';
import { licenseMode, licenseStore } from './resources/license-store';

export const showLicenseModal = writable(false);
export const showAssignedUsersModal = writable(false);
export const applicationModalMode = writable<ApplicationModalMode>('closed');

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
		applicationModalMode.set('closed');
		applicationStore.resetFields();
	}

	function closeAssignedUsers() {
		showAssignedUsersModal.set(false);
	}

	function closeAllModals() {
		contextMenu.close();
		closeApplicationModal();
		closeAssignedUsers();
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
