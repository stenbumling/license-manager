import type { ApplicationAttributes } from '$lib/types/application-types';
import type { UserData, UserInstance } from '$lib/types/user-types';
import type {
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	Model,
} from 'sequelize';

export interface LicenseAttributes {
	id: string;
	applicationId: string;
	expirationDate: string;
	autoRenewal: boolean;
	cost: number;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface LicenseData extends LicenseAttributes {
	users: UserData[];
	application: ApplicationAttributes;
}

export interface LicenseInstance extends Model<LicenseAttributes>, LicenseAttributes {
	addUser: (user: UserInstance) => Promise<void>;
	removeUser: (user: UserInstance) => Promise<void>;
	getUsers: BelongsToManyGetAssociationsMixin<UserInstance>;
	setUsers: BelongsToManySetAssociationsMixin<UserInstance, UserInstance['id']>;
}

export interface LicenseCounts {
	all: number;
	inUse: number;
	unassigned: number;
	nearExpiration: number;
	expired: number;
}

export type LicenseModalMode = 'add' | 'view';
