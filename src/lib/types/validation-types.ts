export interface LicenseValidationErrors {
	applicationId?: { message: string };
	expirationDate?: { message: string };
	cost?: { message: string };
	renewalInterval?: { message: string };
	category?: { message: string };
	status?: { message: string };
	contactPerson?: { message: string };
	additionalContactInfo?: { message: string };
	comment?: { message: string };
}

export interface ApplicationValidationError {
	name?: { message: string };
	link?: { message: string };
}
