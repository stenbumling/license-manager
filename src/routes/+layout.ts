import { applicationStore } from '$lib/stores/application-store';
import { licenseStore } from '$lib/stores/license-store';

export const load = async ({ fetch }) => {
	try {
		const [licenseResponse, applicationResponse] = await Promise.all([
			fetch('/api/license/'),
			fetch('/api/application/'),
		]);

		if (!licenseResponse.ok || !applicationResponse.ok) throw new Error('Failed to load data');
		const licenses = await licenseResponse.json();
		licenseStore.set(licenses);
		const applications = await applicationResponse.json();
		applicationStore.set(applications);

		return { licenses, applications };
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
};
