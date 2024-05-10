import type { WhereOptions } from 'sequelize';

export type WhereOptionsWithSymbols = WhereOptions & {
	[key in symbol]?: unknown;
};

export interface QueryParams {
	filter: FilterQuery;
	search: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}

export type FilterQuery = 'all' | 'assigned' | 'unassigned' | 'near-expiration' | 'expired';
export type FilterReadableName =
	| 'All'
	| 'In use'
	| 'Unassigned'
	| 'Near expiration'
	| 'Expired'
	| 'Search';
export type SortColumn = 'application' | 'contactPerson' | 'users' | 'expirationDate' | 'createdAt';
export type SortDirection = 'ASC' | 'DESC' | 'DEFAULT';

export type DateStatus = 'ok' | 'warning' | 'alert' | 'invalid';
