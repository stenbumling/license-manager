import { building } from '$app/environment';
import { SKIP_AUTH } from '$env/static/private';
import { redirectToAuthCodeUrl } from '$lib/auth/services';
import { initDb } from '$lib/server/db';
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import {
	AccessDeniedError,
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
	/*
	 * Check if the user is authenticated before allowing access to the app.
	 * Set SKIP_AUTH to 'true' in the env.local file to skip authentication.
	 * In production, the SKIP_AUTH variable will not be accessible to the client, so
	 * it will always be set to 'false'.
	 */
	if (SKIP_AUTH !== 'true' && !(event.route.id && event.route.id.includes('callback'))) {
		if (!event.cookies.get('idToken') || !event.cookies.get('accessToken')) {
			const authCodeUrl = await redirectToAuthCodeUrl(event);
			if (authCodeUrl) {
				redirect(302, authCodeUrl);
			} else {
				error(500, {
					status: 500,
					type: 'Authentication Error',
					message: 'Failed to redirect to authentication page',
				});
			}
		}
	}

	// Used to preload fonts (only css and js are preloaded by default otherwise)
	return await resolve(event, {
		preload: ({ type }) => type === 'font' || type === 'css' || type === 'js',
	});
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.error(`An error has occurred on ${event.url.pathname}:\n`, error);

	const errorResponse: App.Error = {
		status: status || 500,
		type: 'Internal Error',
		message: message || 'An unexpected error occurred',
	};

	if (status === 404) {
		errorResponse.status = 404;
		errorResponse.type = 'Not Found';
		errorResponse.message = 'The requested page or resource could not be found.';
		return errorResponse;
	}

	if (error instanceof ValidationError) {
		errorResponse.status = 400;
		errorResponse.type = 'Validation Error';
		errorResponse.message = 'There was an error in validating the data provided';
		errorResponse.details = error.errors.map((err) => `${err.path}: ${err.message}`);
	}

	if (error instanceof UniqueConstraintError) {
		errorResponse.status = 409;
		errorResponse.type = 'Unique Constraint Error';
		errorResponse.message = 'The following fields have duplicate values';
		errorResponse.details = Object.keys(error.fields).join(', ');
	}

	if (error instanceof ForeignKeyConstraintError) {
		errorResponse.status = 400;
		errorResponse.type = 'Foreign Key Constraint Error';
		errorResponse.message = error.message;
	}

	if (error instanceof DatabaseError) {
		errorResponse.status = 500;
		errorResponse.type = 'Database Error';
		errorResponse.message = error.message;
	}

	if (error instanceof ConnectionError) {
		errorResponse.status = 500;
		errorResponse.type = 'Database Connection Error';
		errorResponse.message = error.message;
	}

	if (error instanceof AccessDeniedError) {
		errorResponse.status = 403;
		errorResponse.type = 'Database Access Denied';
		errorResponse.message = error.message;
	}

	if (error instanceof Error) {
		errorResponse.status = 500;
		errorResponse.type = 'Internal Server Error';
		errorResponse.message = error.message;
	}

	return errorResponse;
};
