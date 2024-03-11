import { describe, it } from 'vitest';

describe('createTableController', () => {
	describe('updateFilterState', () => {
		it.todo('should update the filter state');
	});

	describe('updateSortState', () => {
		it.todo('should update the sort state for a specified column and direction');
		it.todo('should reset other columns to default sort state when a new column is sorted');
		it.todo('should toggle the sort order of a column when called consecutively');
	});

	describe('updateTableState', () => {
		it.todo(
			'should construct a correct query based on current filter, sort, and search states and send it to the database',
		);
		it.todo('should handle the response correctly by updating the licenseStore with fetched data');
		it.todo('should reset table state and display a warning if the server returns a 400 error');
		it.todo(
			'should display an error notification and set the license store to an empty array on server error',
		);
	});

	describe('resetTableState', () => {
		it.todo('should reset filter, sort, and search states to their defaults');
		it.todo('should fetch the table state with default settings');
	});

	describe('sendQueryToDatabase', () => {
		it.todo('should start loading before sending a query');
		it.todo('should end loading after receiving the response');
		it.todo('should set the license store with the response data on successful fetch');
		it.todo(
			'should handle errors gracefully, including setting appropriate error states and showing notifications',
		);
	});
});
