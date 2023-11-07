import { get, writable } from 'svelte/store';
import type { License } from './license-store';

export const searchQuery = writable('');
export const activeFilter = writable('All');
export const tableData = writable<License[]>([]);
export const sortState = writable({ column: '', order: '' });

function createTableStore() {
	const { subscribe, set, update } = writable<License[]>([]);
	const { subscribe: subscribeSort, set: setSort } = sortState;

	function setActiveFilter(filter: string) {
		activeFilter.set(filter);
		applyFilter(filter);
	}

	async function applyFilter(
		filterName: string,
		searchQueryParam = get(searchQuery),
		sortColumn?: string,
		sortOrder?: string,
	) {
		let query: string = '';
		switch (filterName) {
			case 'All':
				query = '?';
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
				if (searchQueryParam === '') {
					query = '?';
					activeFilter.set('All');
				} else {
					query = `?search=${searchQueryParam}`;
					activeFilter.set('Search');
				}
				break;
			default:
				console.error(`Unknown filter: ${filterName}`);
				query = '?';
				break;
		}

		const currentSort =
			sortColumn && sortOrder ? { column: sortColumn, order: sortOrder } : get(sortState);

		if (sortColumn && sortOrder) {
			setSort(currentSort);
		}

		if (currentSort.column && currentSort.order) {
			query += `&sortBy=${currentSort.column}&sortDirection=${currentSort.order}`;
		}

		filterTable(query);
	}

	async function sortTable(column: string, sortOrder: string, searchQueryParam?: string) {
		let filter = get(activeFilter);
		applyFilter(filter, searchQueryParam, column, sortOrder);
	}

	async function filterTable(query: string) {
		try {
			const response = await fetch(`/api/license/filter${query}`);
			console.log(response);
			const licenses = await response.json();
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
		sort: sortTable,
		subscribeSort,
	};
}

export const table = createTableStore();
