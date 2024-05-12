import { sequelize } from '$lib/server/db';
import type { UserInstance } from '$lib/types/user-types';
import { DataTypes } from 'sequelize';

const UserModel = sequelize.define<UserInstance>('user', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		validate: {
			isUUID: 4,
		},
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1, 100],
		},
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		validate: {
			isDate: true,
		},
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		validate: {
			isDate: true,
		},
	},
});

export default UserModel;
