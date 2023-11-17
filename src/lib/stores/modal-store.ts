import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import { applicationStore } from './application-store';
import { contextMenu } from './context-menu-store';
import { licenseFetchError, licenseMode, licenseStore } from './license-store';

export const showLicenseModal = writable(false);
export const showApplicationModal = writable(false);
export const showAssignedUsersModal = writable(false);

function createModalController() {
	function validateLicenseId(uuid: string) {
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		return regex.test(uuid);
	}

	async function openLicense(licenseId?: string) {
		const { url } = get(page);
		const modal = url.searchParams.get('modal');
		const paramId = url.searchParams.get('id');

		if (licenseId && licenseId !== 'add') {
			await setModal('view', `/?modal=view&id=${licenseId}`, licenseId);
		} else if (modal === 'add' || licenseId === 'add') {
			await setModal('add', '/?modal=add');
		} else if (modal === 'view' && paramId && validateLicenseId(paramId)) {
			await setModal('view', `/?modal=view&id=${paramId}`, paramId);
		} else {
			showLicenseModal.set(false);
			await goto('/');
		}
	}

	async function setModal(mode: 'add' | 'view', path: string, licenseId?: string) {
		await goto(path);
		licenseMode.set(mode);
		if (licenseId) {
			await licenseStore.fetch(licenseId);
		} else {
			licenseFetchError.set('');
			licenseStore.resetFields();
		}
		showLicenseModal.set(true);
	}

	async function closeLicense() {
		contextMenu.close();
		showLicenseModal.set(false);
		await goto('/');
		// Reset after closing animation is done
		setTimeout(() => {
			licenseStore.resetFields();
		}, 120);
	}

	function closeApplication() {
		showApplicationModal.set(false);
		// Reset after closing animation is done
		setTimeout(() => {
			applicationStore.reset();
		}, 120);
	}

	function closeAssignedUsers() {
		showAssignedUsersModal.set(false);
	}

	return {
		openLicense,
		closeLicense,
		closeApplication,
		closeAssignedUsers,
	};
}

export const modal = createModalController();
