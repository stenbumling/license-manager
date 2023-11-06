import { writable } from 'svelte/store';

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

	function updatePosition(referenceElementRect: DOMRect, contextMenuRect: DOMRect) {
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

	return {
		subscribe,
		set,
		update,
		close: closeMenu,
		open: setId,
		updatePosition,
	};
}

export const contextMenu = createContextMenuStore();
