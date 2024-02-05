import { error } from '@sveltejs/kit';

interface HttpError {
	body: {
		message?: string;
	};
	status: number;
}

/*
 * Load initial data for the application. This loaded data will be available
 * to all pages through the "data" variable (currently only used in the +layout.svelte file to pass data to stores).
 */

export const load = async ({ fetch }) => {
	try {
		const responses = await Promise.all([
			fetch('/api/licenses'),
			fetch('/api/applications'),
			fetch('/api/users'),
			fetch('/api/licenses/counts'),
		]);

		const failedResponse = responses.find((response) => !response.ok);
		if (failedResponse) {
			const errorResponse = await failedResponse.json();
			console.error(
				`Failed to load data: ${failedResponse.url} responded with status ${failedResponse.status}`,
			);
			throw error(failedResponse.status, {
				message: errorResponse.message || 'Failed to load data',
			});
		}
		return {
			licenses: await responses[0].json(),
			applications: await responses[1].json(),
			users: await responses[2].json(),
			counts: await responses[3].json(),
		};
	} catch (err) {
		const fetchError = err as HttpError;
		console.error(err);
		return {
			error: {
				message: fetchError.body.message || 'An error occurred while loading initial data',
				code: fetchError.status || 500,
			},
		};
	}
};
