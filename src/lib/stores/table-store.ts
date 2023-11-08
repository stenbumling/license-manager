import { get, writable } from 'svelte/store';
import type { License } from './license-store';

export const activeFilter = writable('All');
export const searchQuery = writable('');
export const tableData = writable<License[]>([]);
export const sortState = writable<Record<string, 'ASC' | 'DESC' | 'DEFAULT'>>({
	application: 'DEFAULT',
	contactPerson: 'DEFAULT',
	users: 'DEFAULT',
	renewalDate: 'DEFAULT',
});

function createTableStore() {
	const { subscribe, set, update } = writable<License[]>([]);

	function setActiveFilter(filter: string) {
		activeFilter.set(filter);
		const sortStateValue = get(sortState);
		const sortColumn = Object.keys(sortStateValue).find((key) => sortStateValue[key] !== 'DEFAULT');
		const sortOrder = sortColumn ? sortStateValue[sortColumn] : 'DEFAULT';
		applyFilter(filter, get(searchQuery), sortColumn, sortOrder);
	}

	function handleSort(column: string) {
		sortState.update((currentState) => {
			if (currentState[column] === 'DEFAULT') {
				// Reset other columns to 'DEFAULT'
				for (let key in currentState) {
					currentState[key] = 'DEFAULT';
				}
			}

			// Update the sort order for the current column
			switch (currentState[column]) {
				case 'DEFAULT':
					currentState[column] = 'ASC';
					break;
				case 'ASC':
					currentState[column] = 'DESC';
					break;
				case 'DESC':
					currentState[column] = 'DEFAULT';
					break;
			}

			// Reapply the filter with the new sort order
			applyFilter(get(activeFilter), get(searchQuery), column, currentState[column]);
			return currentState;
		});
	}

	async function applyFilter(
		filterName: string,
		searchQueryParam = get(searchQuery),
		sortColumn?: string,
		sortOrder: 'ASC' | 'DESC' | 'DEFAULT' = 'DEFAULT',
	) {
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
				if (searchQueryParam === '') {
					query = '';
					activeFilter.set('All');
				} else {
					query = `?search=${searchQueryParam}`;
					activeFilter.set('Search');
				}
				break;
			default:
				console.error(`Unknown filter: ${filterName}`);
				query = '';
				break;
		}

		if (!sortColumn) {
			const sortStateValue = get(sortState);
			sortColumn = Object.keys(sortStateValue).find((key) => sortStateValue[key] !== 'DEFAULT');
			sortOrder = sortColumn ? sortStateValue[sortColumn] : 'DEFAULT';
		}

		if (sortColumn && sortOrder !== 'DEFAULT') {
			const sortQuery = `sortBy=${sortColumn}&sortDirection=${sortOrder}`;
			query += (query ? '&' : '?') + sortQuery;
		}

		filterTable(query);
	}

	async function filterTable(query: string) {
		try {
			const response = await fetch(`/api/license/filter${query}`);
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
		handleSort,
	};
}

export const table = createTableStore();
