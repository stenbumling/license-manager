import { writable } from 'svelte/store';
import { z } from 'zod';

export const userSchema = z
	.string({ invalid_type_error: 'Your search query must be a string' })
	.trim()
	.min(1, { message: 'Please enter a name of a user' })
	.max(100, { message: 'User name can be at most 100 characters long' });

export const userValidationErrors = writable<string[]>([]);

export async function validateUser(user: string): Promise<boolean> {
	try {
		userSchema.parse(user);
		userValidationErrors.set([]);
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.log(error.flatten().formErrors);
			userValidationErrors.set(error.flatten().formErrors);
		} else {
			console.error('Unexpected error when validating application:', error);
		}
		return false;
	}
}
