import { Model } from 'sequelize';
import type { LicenseAttributes } from './license-types';

export interface ApplicationAttributes {
	id: string;
	name: string;
	link: string;
	licenseAssociations: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ApplicationData extends ApplicationAttributes {
	licenses?: LicenseAttributes[];
}

export interface ApplicationInstance extends Model<ApplicationAttributes>, ApplicationAttributes {}

export type ApplicationModalMode = 'closed' | 'list' | 'add' | 'edit';
