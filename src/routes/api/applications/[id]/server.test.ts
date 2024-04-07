import { describe, it } from 'vitest';

describe('PUT /applications/:id', () => {
	it.todo('should return 204 on successful update');
	it.todo('should return 409 when there is an update conflict');
});

describe('DELETE /applications/:id', () => {
	it.todo('should return 204 on successful deletion');
	it.todo('should return 404 when application is not found');
  it.todo('should return 409 when there are licenses associated with the application');
});
