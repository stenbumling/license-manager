import type { Application } from '$lib/stores/application-store';
import { applicationStore } from '$lib/stores/application-store';
import { get, writable } from 'svelte/store';
import { z } from 'zod';

export const applicationSchema = z.object({
	id: z.string().trim().uuid({ message: 'Invalid application ID' }),
	name: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a name of the application' })
		.refine(
			(val) => {
				const applications = get(applicationStore);
				return !applications.some((application) => application.name === val);
			},
			{ message: 'Application name already exists' },
		),
});

export const applicationErrors = writable<ApplicationErrors>({});

interface ApplicationErrors {
	name?: { message: string };
}

export async function validateApplication(application: Application): Promise<boolean> {
	try {
		applicationSchema.parse(application);

		applicationErrors.set({});
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.log(error.flatten().fieldErrors);
			applicationErrors.set(error.flatten().fieldErrors);
		} else {
			console.error('Unexpected error when validating application:', error);
		}
		return false;
	}
}
