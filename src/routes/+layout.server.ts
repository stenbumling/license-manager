export const load = async ({ fetch }) => {
	try {
		const res = await fetch('/api/application/');
		const applicationList = await res.json();
		return { applicationList };
	} catch (error) {
		return { error };
	}
};
