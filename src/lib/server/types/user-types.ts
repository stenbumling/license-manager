import { Model } from 'sequelize';

export interface UserAttributes {
	id?: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
