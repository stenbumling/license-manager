import { applicationStore } from '$lib/stores/application-store';

export const load = async ({ fetch }) => {
	try {
		const res = await fetch('/api/application/');
		if (!res.ok) throw new Error('Failed to fetch application data');
		const applications = await res.json();

		applicationStore.set(applications);

		return { applications };
	} catch (error) {
		console.error('Error:', error);
		return { error };
	}
};
