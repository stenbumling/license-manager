import { modal } from '$lib/stores/modal-store';

export function urlListener(node: HTMLElement) {
	node;
	async function handleChange() {
		await modal.handleBrowserHistoryChange();
	}

	window.addEventListener('popstate', handleChange);

	return {
		destroy() {
			window.removeEventListener('popstate', handleChange);
		},
	};
}
