import type {
	BelongsToManyGetAssociationsMixin,
	BelongsToManySetAssociationsMixin,
	Model,
} from 'sequelize';
import type { UserInstance } from './user-types';

export interface LicenseAttributes {
	id?: string;
	applicationId: string;
	autoRenewal: boolean;
	expirationDate: string;
	cost: string;
	renewalInterval: string;
	category: string;
	status: string;
	contactPerson: string;
	additionalContactInfo: string;
	comment: string;
	updatedAt: string;
	createdAt: string;
	users?: UserInstance[];
}

export interface LicenseInstance extends Model<LicenseAttributes>, LicenseAttributes {

	addUser: (user: UserInstance) => Promise<void>;
	removeUser: (user: UserInstance) => Promise<void>;
	getUsers: BelongsToManyGetAssociationsMixin<UserInstance>;
	setUsers: BelongsToManySetAssociationsMixin<UserInstance, UserInstance['id']>;
}
