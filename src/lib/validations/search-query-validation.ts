import { writable } from 'svelte/store';
import { z } from 'zod';

export const searchQuerySchema = z
	.string({ invalid_type_error: 'Your search query must be a string' })
	.trim()
	.max(300, { message: 'Your search query is too long' });

export const searchQueryErrors = writable<string[]>([]);

export async function validateSearchQuery(query: string): Promise<boolean> {
	try {
		searchQuerySchema.parse(query);
		searchQueryErrors.set([]);
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			searchQueryErrors.set(error.flatten().formErrors);
		} else {
			console.error('Unexpected error when validating application:', error);
		}
		return false;
	}
}
