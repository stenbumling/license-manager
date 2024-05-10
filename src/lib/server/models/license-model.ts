import type { LicenseInstance } from '$lib/types/license-types';
import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

const LicenseModel = sequelize.define<LicenseInstance>('license', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		validate: {
			isUUID: 4,
		},
	},
	applicationId: {
		type: DataTypes.UUID,
		allowNull: false,
		validate: {
			isUUID: 4,
		},
	},
	expirationDate: {
		type: DataTypes.DATEONLY,
		allowNull: false,
		validate: {
			isDate: true,
		},
	},
	autoRenewal: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	},
	cost: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 1000000000,
			isInt: true,
		},
	},
	renewalInterval: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			max: 100,
		},
	},
	status: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			max: 100,
		},
	},
	contactPerson: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			max: 200,
		},
	},
	additionalContactInfo: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			max: 200,
		},
	},
	comment: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			max: 1000,
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

export default LicenseModel;
