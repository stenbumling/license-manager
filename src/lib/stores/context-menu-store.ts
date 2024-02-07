import type { License } from '$lib/stores/license-store';
import { modal } from '$lib/stores/modal-store';
import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';
import { licenseStore } from './license-store';
import { notifications } from './notification-store';

/*
 * This store is responsible for managing the state of context menus for licenses.
 * It keeps track of active context menus and their current position on the screen.
 * It also provides a set of common functions to be called by items in the context menu.
 */

type ContextMenuState = {
	position: { top: number; left: number } | null;
	activeId: string | null;
};

const initialState: ContextMenuState = {
	position: null,
	activeId: null,
};

export interface ContextMenuItem {
	label: string;
	action: () => void;
	icon?: ComponentType;
	class?: 'warning' | 'alert';
}

function createContextMenuStore() {
	const { subscribe, set, update } = writable<ContextMenuState>(initialState);

	function setId(id: string) {
		update((state) => ({
			...state,
			activeId: id,
		}));
	}

	function closeMenu() {
		set(initialState);
	}

	function setPosition(referenceElementRect: DOMRect, contextMenuRect: DOMRect) {
		const top =
			referenceElementRect.bottom > window.innerHeight - contextMenuRect.height - 40
				? referenceElementRect.bottom - contextMenuRect.height
				: referenceElementRect.top;
		const left = referenceElementRect.left - contextMenuRect.width - 10;

		update((state) => ({
			...state,
			position: { top, left },
		}));
	}

	// Assortment of functions to be called by items in the context menu
	function viewLicense(license: License) {
		contextMenu.close();
		modal.openLicense(license.id);
	}

	async function copyLicenseLink(license: License) {
		contextMenu.close();
		try {
			await navigator.clipboard.writeText(`${window.location.origin}?modal=view&id=${license.id}`);
			notifications.add({
				message: 'License link copied to clipboard',
				type: 'info',
			});
		} catch (error) {
			console.error('Failed to copy license link to clipboard:', error);
			notifications.add({
				message: 'Failed to copy license link to clipboard',
				type: 'warning',
			});
		}
	}

	async function copyLicenseData(license: License) {
		contextMenu.close();
		try {
			await navigator.clipboard.writeText(JSON.stringify(license, null, 2));
			notifications.add({
				message: 'License link data to clipboard',
				type: 'info',
			});
		} catch (error) {
			console.error('Failed to copy license data to clipboard:', error);
			notifications.add({
				message: 'Failed to copy license data to clipboard',
				type: 'warning',
			});
		}
	}

	async function deleteLicense(license: License) {
		modal.closeLicense();
		await licenseStore.delete(license.id, license.applicationId);
	}

	return {
		subscribe,
		close: closeMenu,
		open: setId,
		setPosition,
		viewLicense,
		copyLicenseLink,
		copyLicenseData,
		deleteLicense,
	};
}

export const contextMenu = createContextMenuStore();
