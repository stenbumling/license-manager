import { building } from '$app/environment';
import { ConnectionError, ConnectionTimedOutError, Sequelize, TimeoutError } from 'sequelize';
import type { ConnectionConfiguration } from 'tedious';

export const sequelize = (() => {
	if (building) {
		return new Sequelize({
			dialect: 'mssql',
		});
	} else {
		const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
		if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
			throw new Error(
				'Missing database configuration! Make sure you have set the following environment variables: DB_HOST, DB_NAME, DB_USER and DB_PASSWORD. Check the .env.locals.example file for reference.',
			);
			// TODO: Handle this error in a more graceful and user-friendly way
		}

		return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
			host: DB_HOST,
			dialect: 'mssql',
			dialectOptions: {
				options: getTediousConnectionOptions(),
			},
			logging: (query) => console.log(new Date(), query),
			retry: getRetryOptions(),
		});
	}
})();

function getTediousConnectionOptions() {
	const options: ConnectionConfiguration['options'] = {
		connectTimeout: 60000,
		requestTimeout: 60000,
		datefirst: 1,
	};
	return options;
}

function getRetryOptions() {
	return {
		max: 3,
		timeout: 60000,
		match: [
			ConnectionError,
			ConnectionTimedOutError,
			TimeoutError,
			'SequelizeConnectionError',
			'SQLITE_BUSY',
		],
	};
}

export async function initDb() {
	try {
		await authenticateDb();
		await syncDbModels();
	} catch (error) {
		console.error('Unable to connect to the database: ', error);
		// TODO: Handle this in a more graceful and user-friendly way
	}
}

async function authenticateDb() {
	await sequelize.authenticate();
	console.log('Connection to the database has been established successfully.');
}

async function syncDbModels() {
	await import('./models/model-associations');
	await sequelize.sync();
	console.log('Database schemas synchronized with the models');
}
