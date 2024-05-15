import '@testing-library/jest-dom/vitest';
import '@testing-library/svelte/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { applicationStore } from './src/lib/stores/resources/application-store';
import { licenseStore } from './src/lib/stores/resources/license-store';
import { userStore } from './src/lib/stores/resources/user-store';
import { server } from './src/mocks/setup/node';

beforeAll(() => {
	setupMocks();
	server.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
	server.resetHandlers();
	userStore.set([]);
	licenseStore.set([]);
	applicationStore.set([]);
});
afterAll(() => {
	vi.resetAllMocks();
	server.close();
});

function setupMocks() {
	vi.mock('./src/lib/server/db', async (importOriginal) => {
		const { sequelize } = await importOriginal<typeof import('./src/lib/server/db')>();
		const mockSequelizeInstance = {
			...sequelize,
			define: sequelize.define.bind(sequelize),
			transaction: async () => ({
				commit: vi.fn(),
				rollback: vi.fn(),
			}),
			literal: sequelize.literal.bind(sequelize),
		};
		return {
			sequelize: mockSequelizeInstance,
		};
	});
	vi.mock('./src/lib/server/models/license-model');
	vi.mock('./src/lib/server/models/application-model');
	vi.mock('./src/lib/server/models/user-model');
	vi.mock('./src/lib/server/models/model-associations');
	vi.mock('./src/lib/server/services/query-services');
}
