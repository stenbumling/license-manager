import { Model } from 'sequelize';
import type { LicenseAttributes } from './license-types';

export interface UserAttributes {
	id?: string;
	name: string;
	active?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	licenses?: LicenseAttributes[];
}

export interface AzureAdGroupUser {
	id: string;
	displayName: string;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
