import { describe, it } from 'vitest';

describe('Application Store', () => {
	describe('getLicenseById', () => {
		it.todo('should successfully fetch a license by id from the server and update the store');
    it.todo('should not update store if server request fails');
	});

	describe('updateLicenseCounts', () => {
		it.todo('should successfully update the license counts and update the store');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('addLicense', () => {
		it.todo('should successfully add a license to the server and update the store');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('updateLicense', () => {
		it.todo('should successfully update a license');
    it.todo('should not update store if data conflict and display an error message');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('deleteLicense', () => {
		it.todo('should successfully delete a license');
    it.todo('should not update store if server request fails and display an error message');
	});

	describe('resetFields', () => {
		it.todo('should reset the license writable store to initial values');
		it.todo('should clear any existing validation errors');
	});
});
