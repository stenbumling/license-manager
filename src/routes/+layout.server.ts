import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	let statusCode;
	try {
		const responses = await Promise.all([
			fetch('/api/license'),
			fetch('/api/application'),
			fetch('/api/user'),
			fetch('/api/license/counts'),
		]);

		const failedResponse = responses.find((response) => !response.ok);

		if (failedResponse) {
			console.error(
				`Failed to load data: ${failedResponse.url} responded with status ${failedResponse.status}`,
			);
			statusCode = failedResponse.status;
			throw error(failedResponse.status, {
				message: 'Failed to load all required data',
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
				message: 'An error occurred while loading data',
				code: statusCode,
			},
		};
	}
};
