import type { WhereOptions } from 'sequelize';

export type WhereOptionsWithSymbols = WhereOptions & {
	[key in symbol]?: unknown;
};

export type Filter = 'all' | 'assigned' | 'unassigned' | 'near-expiration' | 'expired';
export type SortBy = 'application' | 'contactPerson' | 'users' | 'expirationDate';
export type SortDirection = 'ASC' | 'DESC';
