import { goto } from '$app/navigation';
import type { License } from '$lib/stores/license-store';
import { writable } from 'svelte/store';
import { licenseStore } from './license-store';

type ContextMenuState = {
	position: { top: number; left: number } | null;
	activeId: string | null;
};

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
			referenceElementRect.bottom > window.innerHeight - contextMenuRect.height
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
		goto(`/?modal=edit&id=${license.id}`);
	}

	function copyLicenseLink(license: License) {
		contextMenu.close();
		navigator.clipboard.writeText(`${window.location.origin}/license/view/${license.id}`);
	}

	function copyLicenseData(license: License) {
		contextMenu.close();
		navigator.clipboard.writeText(JSON.stringify(license));
	}

	function deleteLicense(license: License) {
		contextMenu.close();
		licenseStore.delete(license.id);
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
