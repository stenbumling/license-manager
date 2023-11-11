import { goto } from '$app/navigation';
import type { License } from '$lib/stores/license-store';
import type { ComponentType } from 'svelte';
import { writable } from 'svelte/store';
import { licenseStore } from './license-store';
import { showLicenseModal } from './modal-state';

type ContextMenuState = {
	position: { top: number; left: number } | null;
	activeId: string | null;
};

export interface ContextMenuItem {
	label: string;
	action: () => void;
	icon?: ComponentType;
	class?: 'warning' | 'alert';
}

const initialState: ContextMenuState = {
	position: null,
	activeId: null,
};

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
		let top =
			referenceElementRect.bottom > window.innerHeight - contextMenuRect.height - 40
				? referenceElementRect.bottom - contextMenuRect.height
				: referenceElementRect.top;
		let left = referenceElementRect.left - contextMenuRect.width - 10;

		update((state) => ({
			...state,
			position: { top, left },
		}));
	}

	// Assortment of functions to be called by items in the context menu

	function viewLicense(license: License) {
		contextMenu.close();
		goto(`/?modal=view&id=${license.id}`);
	}

	function copyLicenseLink(license: License) {
		contextMenu.close();
		navigator.clipboard.writeText(`${window.location.origin}?modal=view&id=${license.id}`);
	}

	function copyLicenseData(license: License) {
		contextMenu.close();
		navigator.clipboard.writeText(JSON.stringify(license));
	}

	function deleteLicense(license: License) {
		contextMenu.close();
		showLicenseModal.set(false);
		licenseStore.delete(license.id);
		licenseStore.resetFields();
		goto('/');
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
