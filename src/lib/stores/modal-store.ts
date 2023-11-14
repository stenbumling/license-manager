import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { writable } from 'svelte/store';
import { applicationStore } from './application-store';
import { contextMenu } from './context-menu-store';
import { licenseFetchError, licenseMode, licenseStore } from './license-store';

export const showLicenseModal = writable(false);
export const showApplicationModal = writable(false);
export const showAssignedUsersModal = writable(false);

function createModalStore() {
	const { subscribe, set, update } = writable(false);

	function validateLicenseId(uuid: string) {
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		return regex.test(uuid);
	}

	async function openLicense(licenseId?: string) {
		let currentPage;
		let modal;
		let paramId;
		const unsubscribe = page.subscribe((value) => {
			currentPage = value;
			modal = currentPage.url.searchParams.get('modal');
			paramId = currentPage.url.searchParams.get('id');

			if (licenseId && licenseId !== 'add') {
				goto(`/?modal=view&id=${licenseId}`);
				licenseMode.set('view');
				licenseStore.fetch(licenseId);
				showLicenseModal.set(true);
				return;
			} else if (modal === 'add' || licenseId === 'add') {
				goto('/?modal=add');
				licenseFetchError.set('');
				licenseMode.set('add');
				showLicenseModal.set(true);
				licenseStore.resetFields();
			} else if (modal === 'view' && paramId && validateLicenseId(paramId)) {
				licenseMode.set('view');
				licenseStore.fetch(paramId);
				showLicenseModal.set(true);
			} else {
				showLicenseModal.set(false);
				goto('/');
			}
		});

		unsubscribe();
	}

	function closeLicense() {
		contextMenu.close();
		showLicenseModal.set(false);
		goto('/');
		setTimeout(() => {
			licenseStore.resetFields();
		}, 120);
	}

	function closeApplication() {
		showApplicationModal.set(false);
		setTimeout(() => {
			applicationStore.reset();
		}, 120);
	}

	function closeAssignedUsers() {
		showAssignedUsersModal.set(false);
	}

	return {
		subscribe,
		set,
		update,
		openLicense,
		closeLicense,
		closeApplication,
		closeAssignedUsers,
	};
}

export const modal = createModalStore();
