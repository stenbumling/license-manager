import { building } from '$app/environment';
import { authenticateUser } from '$lib/auth/services';
import { initDb } from '$lib/server/db';
import { type Handle, type HandleServerError } from '@sveltejs/kit';
import {
	ConnectionError,
	DatabaseError,
	ForeignKeyConstraintError,
	UniqueConstraintError,
	ValidationError,
} from 'sequelize';

// Initialize the database connection on startup (disabled while building)
if (!building) {
	await initDb();
}

export const handle: Handle = async ({ event, resolve }) => {
	await authenticateUser(event);

	// Used to preload fonts (only css and js are preloaded by default otherwise)
	return await resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js',
	});
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const err = error as Error;
	console.error(`An error has occurred`, {
		path: event.url.pathname,
		error: err.message,
		stack: err.stack,
	});

	const errorResponse: App.Error = {
		status: status || 500,
		type: 'Internal Error',
		message: message || 'An unexpected error occurred',
	};

	if (status === 404) {
		errorResponse.status = 404;
		errorResponse.type = 'Not Found';
		errorResponse.message = 'The requested page or resource could not be found.';
		errorResponse.details =
			'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
	} else if (error instanceof ValidationError) {
		errorResponse.status = 400;
		errorResponse.type = 'Validation Error';
		errorResponse.message = 'There was an error in validating the data provided';
		errorResponse.details = error.errors.map((err) => `${err.path}: ${err.message}`);
	} else if (error instanceof UniqueConstraintError) {
		errorResponse.status = 409;
		errorResponse.type = 'Unique Constraint Error';
		errorResponse.message = 'The following fields have duplicate values';
		errorResponse.details = Object.keys(error.fields).join(', ');
	} else if (error instanceof ForeignKeyConstraintError) {
		errorResponse.status = 400;
		errorResponse.type = 'Foreign Key Constraint Error';
		errorResponse.message = error.message;
	} else if (error instanceof DatabaseError) {
		errorResponse.status = 500;
		errorResponse.type = 'Database Error';
		errorResponse.message = 'An error occurred while processing the database request';
	} else if (error instanceof ConnectionError) {
		errorResponse.status = 500;
		errorResponse.type = 'Database Connection Error';
		errorResponse.message = 'An error occurred while connecting to the database';
	}

	return errorResponse;
};
