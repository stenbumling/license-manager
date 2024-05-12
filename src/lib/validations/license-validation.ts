import type { LicenseData } from '$lib/types/license-types';
import type { LicenseValidationErrors } from '$lib/types/validation-types';
import moment from 'moment';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const licenseSchema = z.object({
	id: z.string().uuid({ message: 'Invalid license ID' }),
	application: z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(100) }),
	applicationId: z.string().uuid({ message: 'Please select an application' }),
	users: z.array(z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(100) })),
	expirationDate: z
		.string()
		.trim()
		.refine((val) => moment(val, 'YYYY-MM-DD', true).isValid(), {
			message: 'Invalid date format',
		}),
	autoRenewal: z.boolean(),
	cost: z
		.number({
			required_error: 'Cost is required',
			invalid_type_error: 'Cost must be a number',
		})
		.min(0, { message: `Cost can't be negative` })
		.max(1000000000, { message: 'Please enter a cost lower than 1 000 000 000' }),
	renewalInterval: z.string().min(1).trim(),
	category: z
		.string()
		.trim()
		.min(1, { message: 'Please select a category' })
		.trim()
		.max(100, { message: 'Category name can be at most 100 characters long' }),
	status: z
		.string()
		.trim()
		.min(1, { message: 'Please select a status' })
		.trim()
		.max(100, { message: 'Status name can be at most 100 characters long' }),
	contactPerson: z
		.string()
		.trim()
		.max(200, { message: 'Name of contact person can be at most 200 characters long' }),
	additionalContactInfo: z
		.string()
		.trim()
		.max(200, { message: 'Additional contact info can be at most 200 characters long' }),
	comment: z.string().trim().max(1000, { message: 'Comment can be at most 1000 characters long' }),
});

export const licenseValidationErrors = writable<LicenseValidationErrors>({});

export async function validateLicense(license: LicenseData): Promise<boolean> {
	try {
		licenseSchema.parse(license);
		licenseValidationErrors.set({});
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			licenseValidationErrors.set(error.flatten().fieldErrors);
		} else {
			console.error('Unexpected error when validating license:', error);
		}
		return false;
	}
}
