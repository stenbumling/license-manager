import { describe, it } from 'vitest';

describe('Application Store', () => {
	describe('fetchApplications', () => {
		it.todo('should fetch applications from the server and update the store');
    it.todo('should not update store if server request fails');
	});

	describe('addApplication', () => {
		it.todo('should successfully add a new application to the server');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('editApplication', () => {
		it.todo('should successfully edit an application');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('deleteApplication', () => {
		it.todo('should successfully delete an application');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('resetFields', () => {
		it.todo('should reset the application writable store to initial values');
		it.todo('should clear any existing validation errors');
	});
});
