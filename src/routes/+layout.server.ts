export const load = async ({ fetch, url }) => {
	try {
		const [licenseResponse, applicationResponse, userResponse, countsResponse] = await Promise.all([
			fetch('/api/license'),
			fetch('/api/application'),
			fetch('/api/user'),
			fetch('/api/license/counts'),
		]);

		if (!licenseResponse.ok || !applicationResponse.ok || !userResponse.ok || !countsResponse.ok)
			throw new Error('Failed to load data');

		return {
			licenses: await licenseResponse.json(),
			applications: await applicationResponse.json(),
			users: await userResponse.json(),
			counts: await countsResponse.json(),
		};
	} catch (error) {
		console.error('Error:', error);
		return { error: 'An error occurred' };
	}
};
