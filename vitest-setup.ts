import '@testing-library/jest-dom/vitest';
import '@testing-library/svelte/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { applicationStore } from './src/lib/stores/resources/application-store';
import { licenseStore } from './src/lib/stores/resources/license-store';
import { userStore } from './src/lib/stores/resources/user-store';
import { server } from './src/mocks/setup/node';

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
	server.resetHandlers();
	userStore.set([]);
	licenseStore.set([]);
	applicationStore.set([]);
});
afterAll(() => {
	server.close();
});
