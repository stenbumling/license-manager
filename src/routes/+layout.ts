import { applicationStore } from '$lib/stores/application-store';
import { licenseStore } from '$lib/stores/license-store';
import { filterCount, tableData } from '$lib/stores/table-store';
import { userStore } from '$lib/stores/user-store';

export const load = async ({ fetch }) => {
	try {
		const [licenseResponse, applicationResponse, userResponse] = await Promise.all([
			fetch('/api/license'),
			fetch('/api/application'),
			fetch('/api/user'),
		]);

		if (!licenseResponse.ok || !applicationResponse.ok || !userResponse.ok)
			throw new Error('Failed to load data');

		const { licenses, counts } = await licenseResponse.json();

		licenseStore.set(licenses);
		console.log(counts);
		filterCount.set(counts);
		tableData.set(licenses);
		const applications = await applicationResponse.json();
		applicationStore.set(applications);
		const users = await userResponse.json();
		userStore.set(users);

		console.log('Licenses: ', licenses);
		console.log('Applications: ', applications);
		console.log('Users: ', users);

		return { licenses, applications, users };
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
};
