import { Sequelize } from 'sequelize';

export const sequelize = createSequelizeInstance();

function createSequelizeInstance() {
	const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

	if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
		throw new Error(
			'Missing database configuration! Make sure you have set the following environment variables: DB_HOST, DB_NAME, DB_USER and DB_PASSWORD. Check the .env.locals.example file for reference.',
		);
		// TODO: Handle database connection errors in a more graceful and user-friendly way
	}
	return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
		host: DB_HOST,
		dialect: 'mssql',
		dialectOptions: {
			options: {
				dateFirst: 1,
			},
		},
	});
}

export async function initDb() {
	try {
		await authenticateDb();
		await syncDbModels();
	} catch (error) {
    console.error('Unable to connect to the database: ', error);
		// TODO: Handle database connection errors in a more graceful and user-friendly way
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