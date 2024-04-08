import { sequelize } from '$lib/server/db.js';
import Application from '$lib/server/models/application-model';
import type { LicenseInstance } from '$lib/server/types/license-types.js';
import type { UserInstance } from '$lib/server/types/user-types.js';
import type { Transaction } from 'sequelize';

export async function updateUserAssociations(
	users: UserInstance[],
	license: LicenseInstance,
	transaction: Transaction,
) {
	const userIds = users.map((user) => user.id);
	await license.setUsers(userIds, { transaction });
	return null;
}

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
