import { DataTypes } from 'sequelize';
import { sequelize } from '../db';

console.log('aaa');

const Application = sequelize.define('application', {
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
		unique: true,
		validate: {
			notEmpty: true,
			max: 100,
		},
	},
	link: {
		type: DataTypes.STRING(500),
		allowNull: true,
		validate: {
			max: 500,
		},
	},
	// This is used to prevent users from deleting an application that has licenses associated with it
	licenseAssociations: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
		validate: {
			min: 0,
			max: 1000000000,
			isInt: true,
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

export default Application;
