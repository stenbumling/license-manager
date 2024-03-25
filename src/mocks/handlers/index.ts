import { handlers as applicationHandlers } from './application';
import { handlers as licenseHandlers } from './license';
import { handlers as userHandlers } from './user';

export const handlers = [
		...userHandlers,
		...licenseHandlers,
		...applicationHandlers
];