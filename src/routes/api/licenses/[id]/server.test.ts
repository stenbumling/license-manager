import { describe, it } from 'vitest';

describe('GET /licenses/:id', () => {
	it.todo('should return 200 on successful fetch');
	it.todo('should return 404 when license does not exist');
});

describe('PUT /licenses/:id', () => {
	it.todo('should return 204 on successful update');
	it.todo('should return 409 when license has been modified since last retrieval');
});

describe('DELETE /licenses/:id', () => {
	it.todo('should return 204 on successful deletion');
	it.todo('should return 404 when license cannot be found');
});