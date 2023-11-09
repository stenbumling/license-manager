import type { License } from '$lib/stores/license-store';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const licenseSchema = z.object({
	id: z.string().trim().uuid({ message: 'Invalid license ID' }),
	application: z.object({ id: z.string().uuid(), name: z.string().trim().min(1) }),
	applicationId: z.string().uuid({ message: 'Please select an application' }),
	users: z.array(z.object({ id: z.string().trim().uuid(), name: z.string().trim().min(1) })),
	renewalDate: z
		.string()
		.trim()
		.refine((val) => !isNaN(Date.parse(val)), {
			message: 'Please select a valid date',
		}),
	autoRenewal: z.boolean(),
	cost: z.number().nonnegative(),
	renewalInterval: z.string().min(1),
	category: z.string().trim().min(1, { message: 'Please select a category' }),
	status: z.string().trim().min(1, { message: 'Please select a status' }),
	contactPerson: z.string().trim(),
	additionalContactInfo: z.string().trim(),
	comment: z.string().trim(),
});

export const licenseErrors = writable<LicenseErrors>({});

interface LicenseErrors {
	applicationId?: { message: string };
	renewalDate?: { message: string };
	cost?: { message: string };
	renewalInterval?: { message: string };
	category?: { message: string };
	status?: { message: string };
	contactPerson?: { message: string };
	additionalContactInfo?: { message: string };
	comment?: { message: string };
}

export async function validateLicense(license: License): Promise<boolean> {
	try {
		licenseSchema.parse(license);
		licenseErrors.set({});
		return true;
	} catch (error) {
		if (error instanceof z.ZodError) {
			licenseErrors.set(error.flatten().fieldErrors);
		} else {
			console.error('Unexpected error when validating license:', error);
		}
		return false;
	}
}
