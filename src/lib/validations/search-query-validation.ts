import { notifications } from '$lib/stores/notification-store';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const searchQuerySchema = z
	.string({ invalid_type_error: 'Your search query must be a string' })
	.trim()
	.max(70, { message: 'Your search query is too long' });

export const searchQueryValidationError = writable<string[]>([]);

export async function validateSearchQuery(query: string): Promise<boolean> {
	try {
		searchQuerySchema.parse(query);
		searchQueryValidationError.set([]);
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Validation threw the following error:', error);
			searchQueryValidationError.set(error.flatten().formErrors);
			notifications.add({
				message: error.flatten().formErrors[0] || 'Your search query is invalid',
				type: 'warning',
				timeout: 10000,
			});
		} else {
			console.error('Unexpected error when validating search query:', error);
		}
		return false;
	}
}
