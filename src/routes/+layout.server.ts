import { error } from '@sveltejs/kit';

/*
 * Load initial data for the application. This loaded data will be available
 * to all pages through the "data" variable (currently only used in the +layout.svelte file to pass data to stores).
 */

export const load = async ({ fetch }) => {
	let statusCode = 500;
	try {
		const responses = await Promise.all([
			fetch('https://nexer-orebro-license-app-server.azurewebsites.net/api/licenses'),
			fetch('https://nexer-orebro-license-app-server.azurewebsites.net/api/applications'),
			fetch('https://nexer-orebro-license-app-server.azurewebsites.net/api/users'),
			fetch('https://nexer-orebro-license-app-server.azurewebsites.net/api/licenses/counts'),
		]);

		const failedResponse = responses.find((response) => !response.ok);

		if (failedResponse) {
			statusCode = failedResponse.status;
			console.error(
				`Failed to load data: ${
					failedResponse.url ? failedResponse.url : 'The server'
				} responded with status ${failedResponse.status}`,
			);
			error(500, {
				message: 'Failed to load data',
			});
		}
		return {
			licenses: await responses[0].json(),
			applications: await responses[1].json(),
			users: await responses[2].json(),
			counts: await responses[3].json(),
		};
	} catch (err) {
		console.error(err);
		return {
			error: {
				message: 'An error occurred while loading initial data',
				code: statusCode,
			},
		};
	}
};
