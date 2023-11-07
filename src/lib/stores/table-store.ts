import { writable } from 'svelte/store';
import type { License } from './license-store';

export const searchQuery = writable('');
export const activeFilter = writable('All');
export const activeSort = writable('Name');
export const tableData = writable<License[]>([]);

function createTableStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	function setActiveFilter(filter: string) {
		activeFilter.set(filter);
		applyFilter(filter);
	}

	async function applyFilter(filterName: string, searchQuery?: string) {
		let query: string = '';
		switch (filterName) {
			case 'All':
				query = '';
				break;
			case 'In use':
				query = '?users=true';
				break;
			case 'Unassigned':
				query = '?users=false';
				break;
			case 'Near expiration':
				query = '?nearExpiration=true';
				break;
			case 'Expired':
				query = '?expired=true';
				break;
			case 'Search':
				if (searchQuery) {
					query = `?search=${searchQuery}`;
					activeFilter.set('Search');
				}
				break;
			default:
				console.error(`Unknown filter: ${filterName}`);
				query = '';
		}
		filterTable(query);
	}

	async function filterTable(query: string) {
		try {
			const response = await fetch(`/api/license/filter${query}`);
			const licenses = await response.json();
			console.log('Filtered licenses:', licenses);
			tableData.set(licenses);
		} catch (error) {
			console.error(`Failed to fetch licenses with the query "${query}":`, error);
		}
	}

	return {
		subscribe,
		set,
		update,
		setActiveFilter,
		applyFilter,
	};
}

export const table = createTableStore();
