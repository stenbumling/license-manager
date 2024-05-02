import type { LicenseInstance } from '$lib/server/types/license-types';
import type { UserInstance } from '$lib/server/types/user-types';
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