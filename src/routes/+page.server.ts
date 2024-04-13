import { error } from '@sveltejs/kit';

/*
 * Load initial data for the application. This loaded data will be available
 * to all pages through the "data" variable (currently only used in the +page.svelte file to pass data to stores).
 */

export const load = async ({ fetch }) => {
	const responses = await Promise.all([
		fetch('/api/licenses'),
		fetch('/api/applications'),
		fetch('/api/users'),
		fetch('/api/licenses/counts'),
	]);

	handleFailedResponses(responses);

	return {
		licenses: await responses[0].json(),
		applications: await responses[1].json(),
		users: await responses[2].json(),
		counts: await responses[3].json(),
	};
};

function handleFailedResponses(responses: Response[]) {
	const failedResponses = responses.filter((response) => !response.ok);

	if (failedResponses.length > 0) {
		failedResponses.forEach((response) =>
			console.error(
				`Failed to load data: ${response.url ? response.url : 'The server'} responded with status ${
					response.status
				}`,
			),
		);
		error(500, {
			status: 500,
			type: 'Internal Error',
			message: 'Failed to load initial data',
		});
	}
}
