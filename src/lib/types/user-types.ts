import { Model } from 'sequelize';
import type { LicenseAttributes } from './license-types';

export interface UserAttributes {
	id: string;
	name: string;
	active: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserData extends Model<UserAttributes>, UserAttributes {
	licenses?: LicenseAttributes[];
}

export interface AzureAdGroupUser {
	id: string;
	displayName: string;
}

export interface FilteredUsersForUserSync {
	toAdd: AzureAdGroupUser[];
	toDelete: UserData[];
	toFlagAsInactive: UserData[];
	toUpdate: UserData[];
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
