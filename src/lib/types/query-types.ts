import type { WhereOptions } from 'sequelize';

export type WhereOptionsWithSymbols = WhereOptions & {
	[key in symbol]?: unknown;
};

export type FilterQuery = 'all' | 'assigned' | 'unassigned' | 'near-expiration' | 'expired';
export type FilterReadableName =
	| 'All'
	| 'In use'
	| 'Unassigned'
	| 'Near expiration'
	| 'Expired'
	| 'Search';
export type SortColumn = 'application' | 'contactPerson' | 'users' | 'expirationDate';
export type SortDirection = 'ASC' | 'DESC' | 'DEFAULT';
