import { applicationStore } from '$lib/stores/application-store';
import { licenseCounts, licenseStore } from '$lib/stores/license-store';
import { tableState } from '$lib/stores/table-store';
import { userStore } from '$lib/stores/user-store';

export const load = async ({ fetch }) => {
	try {
		const [licenseResponse, applicationResponse, userResponse, countsResponse] = await Promise.all([
			fetch('/api/license'),
			fetch('/api/application'),
			fetch('/api/user'),
			fetch('/api/license/counts'),
		]);

		if (!licenseResponse.ok || !applicationResponse.ok || !userResponse.ok || !countsResponse.ok)
			throw new Error('Failed to load data');

		const licenses = await licenseResponse.json();
		licenseStore.set(licenses);
		tableState.set(licenses);

		const applications = await applicationResponse.json();
		applicationStore.set(applications);

		const users = await userResponse.json();
		userStore.set(users);

		const counts = await countsResponse.json();
		licenseCounts.set(counts);

		console.log('Licenses: ', licenses);
		console.log('Applications: ', applications);
		console.log('Users: ', users);
		console.log('Counts: ', counts);

		return { licenses, applications, users, counts };
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
};
