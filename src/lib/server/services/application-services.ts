import { sequelize } from '$lib/server/db';
import Application from '$lib/server/models/application-model';
import type { LicenseInstance } from '$lib/server/types/license-types';
import type { Transaction } from 'sequelize';

export async function updateLicenseAssociations(
	license: LicenseInstance,
	transaction: Transaction,
	change: '+' | '-' = '+',
) {
	await Application.update(
		{
			licenseAssociations: sequelize.literal(`licenseAssociations ${change} 1`),
		},
		{
			where: { id: license.applicationId },
			transaction,
		},
	);
	return null;
}
