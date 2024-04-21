import { get, writable } from 'svelte/store';
import { notifications } from '../notification-store';
import { request, tableFetchRequest } from '../request-state-store';
import { licenseStore } from './license-store';

/*
 * This store is responsible for managing the state of the license table. That
 * includes what filter is currently active, what the current sort order is,
 * and what the current search query is. Everytime the state of the table
 * changes in any way, the store will construct and send a query to the database
 * to fetch the licenses that match the current state of the table.
 */

// Stores for managing queries and state of the table
export const searchQuery = writable('');
export const filterState = writable('All');
export const sortState = writable<Record<string, 'ASC' | 'DESC' | 'DEFAULT'>>({
	application: 'DEFAULT',
	contactPerson: 'DEFAULT',
	users: 'DEFAULT',
	expirationDate: 'DEFAULT',
});

// Used to render the search query in the table if no results are found
export const currentSearch = writable('');

function createTableController() {
	async function updateFilterState(filter: string) {
		filterState.set(filter);
		await updateTableState();
	}

	async function updateSortState(column: string) {
		sortState.update((currentState) => {
			updateSortOrder(column, currentState);
			return currentState;
		});
		await updateTableState();
	}

	async function updateTableState() {
		const { sortColumn, sortOrder } = getSortState();
		const query = constructFilterQuery(get(filterState), get(searchQuery), sortOrder, sortColumn);
		await sendQueryToDatabase(query);
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
				return '?filter=all';
			case 'In use':
				return '?filter=assigned';
			case 'Unassigned':
				return '?filter=unassigned';
			case 'Near expiration':
				return '?filter=near-expiration';
			case 'Expired':
				return '?filter=expired';
			case 'Search':
				currentSearch.set(searchQueryParam);
				return searchQueryParam === '' ? '' : `?search=${searchQueryParam}`;
			default:
				console.error(`Unknown filter: ${filterName}`);
				return 'filter=all';
		}
	}

	async function resetTableState() {
		filterState.set('All');
		sortState.set({
			application: 'DEFAULT',
			contactPerson: 'DEFAULT',
			users: 'DEFAULT',
			expirationDate: 'DEFAULT',
		});
		searchQuery.set('');
		currentSearch.set('');
		await updateTableState();
	}

	async function sendQueryToDatabase(query: string) {
		try {
			await request.startLoading(tableFetchRequest);
			const response = await fetch(`/api/licenses/query${query}`);
			await request.endLoading(tableFetchRequest, 1000);
			if (response.ok) {
				const licenses = await response.json();
				licenseStore.set(licenses);
			} else {
				const error: App.Error = await response.json();
				if (response.status === 400) {
					notifications.add({
						message: 'The filter was invalid. Table state has been reset.',
						type: 'warning',
					});
					await resetTableState();
				} else {
					request.setError(tableFetchRequest, error);
					licenseStore.set([]);
				}
				console.error(`Failed to fetch licenses with the query "${query}":`, error);
			}
		} catch (error) {
			await request.endLoading(tableFetchRequest);
			request.setError(tableFetchRequest, {
				status: 500,
				type: 'Internal Server Error',
				message: `Failed to fetch licenses`,
				details: 'Please try refreshing the page. If the problem persists, contact support.',
			});
			licenseStore.set([]);
			console.error(`Failed to fetch licenses with the query "${query}":`, error);
		}
	}

	return {
		filterBy: updateFilterState,
		sortBy: updateSortState,
		updateState: updateTableState,
	};
}

export const table = createTableController();
