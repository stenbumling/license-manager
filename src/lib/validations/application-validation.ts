import type { Application } from '$lib/stores/resources/application-store';
import { applicationStore } from '$lib/stores/resources/application-store';
import { get, writable } from 'svelte/store';
import { z } from 'zod';

export const applicationSchema = z.object({
	id: z.string().uuid({ message: 'Invalid application ID' }),
	name: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a name of the application' })
		.max(100, { message: 'Application name can be at most 100 characters long' })
		.refine(
			(val) => {
				const applications = get(applicationStore);
				return !applications.some((application) => application.name === val);
			},
			{ message: 'Application already exists' },
		),
});

export const applicationValidationError = writable<ApplicationValidationError>({});

interface ApplicationValidationError {
	name?: { message: string };
}

export async function validateApplication(application: Application): Promise<boolean> {
	try {
		applicationSchema.parse(application);
		applicationValidationError.set({});
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			applicationValidationError.set(error.flatten().fieldErrors);
		} else {
			console.error('Unexpected error when validating application:', error);
		}
		return false;
	}
}
