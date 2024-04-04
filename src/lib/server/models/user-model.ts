import { DataTypes } from 'sequelize';
import { sequelize } from '../db';
import type { UserInstance } from '../types/user-types';

const User = sequelize.define<UserInstance>('user', {
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

export default User;
