import { describe, it } from 'vitest';

describe('User Store', () => {
	describe('fetchUsers', () => {
		it.todo('should fetch users from the server and update the store');
		it.todo('should not update store if server request fails');
	});

	describe('findOrCreateUser', () => {
		it.todo('should successfully find an existing user to the server');
    it.todo('should successfully create a new user to the server and update the store');
		it.todo('should not update store if server request fails and display an error message');
	});

	describe('deleteUserFromDatabase', () => {
		it.todo('should successfully delete a user and update the store');
		it.todo('should not update store if server request fails and display an error message');
	});
});
