import '@testing-library/jest-dom/vitest';
import '@testing-library/svelte/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './src/mocks/setup/node';

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
	server.resetHandlers();
});
afterAll(() => {
	server.close();
});
