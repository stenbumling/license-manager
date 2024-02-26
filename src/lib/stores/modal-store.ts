import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import { contextMenu } from './context-menu-store';
import { applicationStore } from './resources/application-store';
import { licenseMode, licenseStore } from './resources/license-store';

export const showLicenseModal = writable(false);
export const applicationModalMode = writable<'closed' | 'list' | 'add' | 'edit'>('closed');
export const showAssignedUsersModal = writable(false);

function createModalController() {
	function validateLicenseId(uuid: string) {
		const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
		return regex.test(uuid);
	}

	// Decides which modal (if any) to open based on the URL
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

	function closeApplicationModal() {
		applicationModalMode.set('closed');
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
		closeApplication: closeApplicationModal,
		closeAssignedUsers,
	};
}

export const modal = createModalController();
