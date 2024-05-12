import { building } from '$app/environment';
import { error } from '@sveltejs/kit';
import {
	AccessDeniedError,
	ConnectionError,
	ConnectionTimedOutError,
	Sequelize,
	TimeoutError,
} from 'sequelize';
import type { ConnectionConfiguration } from 'tedious';

export const sequelize = (() => {
	if (building) {
		return new Sequelize({
			dialect: 'mssql',
		});
	} else {
		const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = checkEnvVariables();

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

function checkEnvVariables() {
	const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
	if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
		console.error(
			'Missing database configurations! Make sure you have set the following environment variables: DB_HOST, DB_NAME, DB_USER and DB_PASSWORD. Check the .env.example file for reference.',
		);
		error(500, {
			status: 500,
			type: 'Database Error',
			message: 'Database configurations are missing',
		});
	} else {
		return { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD };
	}
}

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
		max: 5,
		timeout: 60000,
		match: [
			ConnectionError,
			ConnectionTimedOutError,
			TimeoutError,
			AccessDeniedError,
			'SQLITE_BUSY',
		],
		backoffBase: 1000,
		backoffExponent: 1.6,
		report: (message?: string) => {
			if (message?.includes('Retrying')) {
				console.log('Retrying database connection...');
			}
		},
	};
}

export async function initDb() {
	try {
		console.log('Connecting to the database...');
		await sequelize.authenticate();
		await syncDbModels();
		console.log('Connection to the database has been successfully established.');
	} catch (err) {
		console.error('An error occurred while connecting to the database: ', err);
		error(500, {
			status: 500,
			type: 'Database Error',
			message: 'An error occurred while connecting to the database',
		});
	}
}

async function syncDbModels() {
	await import('$lib/server/models/model-associations');
	await sequelize.sync();
}
