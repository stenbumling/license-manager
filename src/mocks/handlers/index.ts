import { handlers as userHandlers } from './user';
import { handlers as licenseHandlers } from './license';
import { handlers as applicationHandlers } from './application';

export const handlers = [
		...userHandlers,
		...licenseHandlers,
		...applicationHandlers
];