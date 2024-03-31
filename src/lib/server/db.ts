import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
	throw new Error(
		'Missing database configuration! Make sure you have set the following environment variables: DB_HOST, DB_NAME, DB_USER and DB_PASSWORD. Check the .env.locals.example file for reference.',
	);
  // TODO: Handle database connection errors in a more graceful and user-friendly way
}

// Create a new connection to the database
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mssql',
	dialectOptions: {
		options: {
			dateFirst: 1,
		},
	},
});

export async function initDb() {
	try {
		// Authenticate with the database
		await sequelize.authenticate();
		console.log('Connection to the database has been established successfully.');

		// Sync the database schema with the sequelize models
		await sequelize.sync();
		console.log('Database schemas synchronized.');
	} catch (error) {
		// TODO: Handle database connection errors in a more graceful and user-friendly way
		console.error('Unable to connect to the database: ', error);
	}
}

export default sequelize;
