import { applicationStore } from '$lib/stores/resources/application-store';
import type { ApplicationData } from '$lib/types/application-types';
import { get, writable } from 'svelte/store';
import { z } from 'zod';
import type { ApplicationValidationError } from '../types/validation-types';

let appId: string | undefined;

export const applicationSchema = z.object({
	id: z.string().uuid({ message: 'Invalid application ID. Try refreshing the site' }),
	name: z
		.string()
		.trim()
		.min(1, { message: 'Please enter a name of the application' })
		.max(100, { message: 'Application name can be at most 100 characters long' })
		.refine(
			(val) => {
				const applications = get(applicationStore);
				return !applications.some(
					(application) => application.name === val && application.id !== appId,
				);
			},
			{ message: 'Application already exists' },
		),
	link: z
		.string()
		.max(500, { message: 'Link can be at most 500 characters long' })
		.refine((data) => data === '' || z.string().url().safeParse(data).success, {
			message: 'Please enter a valid URL',
		}),
});

export const applicationValidationError = writable<ApplicationValidationError>({});

export async function validateApplication(application: ApplicationData): Promise<boolean> {
	try {
		appId = application.id;
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
