import { get, writable } from 'svelte/store';
import type { License } from './license-store';

export const tableState = writable<License[]>([]);
export const filterState = writable('All');
export const sortState = writable<Record<string, 'ASC' | 'DESC' | 'DEFAULT'>>({
	application: 'DEFAULT',
	contactPerson: 'DEFAULT',
	users: 'DEFAULT',
	renewalDate: 'DEFAULT',
});
export const searchQuery = writable('');

export function createTableStore() {
	const { subscribe } = writable<License[]>([]);

	function updateFilterState(filter: string) {
		filterState.set(filter);
		updateTableState();
	}

	function updateSortState(column: string) {
		sortState.update((currentState) => {
			updateSortOrder(column, currentState);
			return currentState;
		});
		updateTableState();
	}

	function updateTableState() {
		const { sortColumn, sortOrder } = getSortState();
		const query = constructFilterQuery(get(filterState), get(searchQuery), sortOrder, sortColumn);
		sendQueryToDatabase(query);
	}

	function getSortState() {
		const sortStateValue = get(sortState);
		const sortColumn = Object.keys(sortStateValue).find((key) => sortStateValue[key] !== 'DEFAULT');
		const sortOrder = sortColumn ? sortStateValue[sortColumn] : 'DEFAULT';
		return { sortColumn, sortOrder };
	}

	function updateSortOrder(
		column: string,
		currentState: Record<string, 'ASC' | 'DESC' | 'DEFAULT'>,
	) {
		Object.keys(currentState).forEach((key) => {
			if (key !== column) currentState[key] = 'DEFAULT';
		});

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
	}

	function constructFilterQuery(
		filterName: string,
		searchQueryParam: string,
		sortOrder: 'ASC' | 'DESC' | 'DEFAULT',
		sortColumn?: string,
	): string {
		let query = determineBaseQuery(filterName, searchQueryParam);

		if (sortColumn && sortOrder !== 'DEFAULT') {
			const sortQuery = `sortBy=${sortColumn}&sortDirection=${sortOrder}`;
			query += (query ? '&' : '?') + sortQuery;
		}

		return query;
	}

	function determineBaseQuery(filterName: string, searchQueryParam: string): string {
		switch (filterName) {
			case 'All':
				return '';
			case 'In use':
				return '?users=true';
			case 'Unassigned':
				return '?users=false';
			case 'Near expiration':
				return '?nearExpiration=true';
			case 'Expired':
				return '?expired=true';
			case 'Search':
				return searchQueryParam === '' ? '' : `?search=${searchQueryParam}`;
			default:
				console.error(`Unknown filter: ${filterName}`);
				return '';
		}
	}

	async function sendQueryToDatabase(query: string) {
		try {
			const response = await fetch(`/api/license/query${query}`);
			const licenses = await response.json();
			tableState.set(licenses);
		} catch (error) {
			console.error(`Failed to fetch licenses with the query "${query}":`, error);
		}
	}

	return {
		subscribe,
		filterBy: updateFilterState,
		sortBy: updateSortState,
		updateState: updateTableState,
	};
}

export const table = createTableStore();
