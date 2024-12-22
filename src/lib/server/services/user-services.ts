import { sequelize } from '$lib/server/db';
import LicenseModel from '$lib/server/models/license-model';
import UserModel from '$lib/server/models/user-model';
import type { AzureAdGroupUser, FilteredUsersForUserSync, UserData } from '$lib/types/user-types';
import { error } from '@sveltejs/kit';

export async function getUsersFromDatabase(): Promise<UserData[]> {
	const userInstances = await UserModel.findAll({
		attributes: { exclude: ['createdAt'] },
		include: [
			{
				model: LicenseModel,
				attributes: ['id'],
				through: { attributes: [] },
			},
		],
		order: [['name', 'ASC']],
	});
	return userInstances.map((user) => user.toJSON());
}

export async function getAzureAdGroupMembers(token: string): Promise<AzureAdGroupUser[]> {
	const { AZURE_AD_GROUP_ID } = process.env;
	if (!AZURE_AD_GROUP_ID) {
		throw new Error('AZURE_AD_GROUP_ID is not set in the environment variables');
	}

	const response = await fetch(
		`https://graph.microsoft.com/v1.0/groups/${AZURE_AD_GROUP_ID}/members?$select=id,displayName`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	if (response.ok) {
		const data = await response.json();
		return data.value;
	} else {
		const err: App.Error = await response.json();
		console.error('Azure AD Error:', err);
		error(500, {
			status: 500,
			type: 'Azure AD Error',
			message: 'Failed to retrieve group members',
		});
	}
}

/**
 * Used with `syncUserTableWithAzureAdGroup` to determine which users need to be added, deleted, flagged, or updated.
 * @param azureAdGroupUsers
 * @param dbUsers
 */
export function filterUsersForUserSync(
	azureAdGroupUsers: AzureAdGroupUser[],
	dbUsers: UserData[],
): FilteredUsersForUserSync {
	const azureAdUserIds = azureAdGroupUsers.map((user) => user.id);
	const dbUserIds = dbUsers.map((user) => user.id);

	const toAdd = azureAdGroupUsers.filter((user) => user.id && !dbUserIds.includes(user.id));
	const toDelete = dbUsers.filter(
		(user) =>
			user.id && !azureAdUserIds.includes(user.id) && user.licenses && user.licenses.length === 0,
	);
	const toFlagAsInactive = dbUsers.filter(
		(user) =>
			user.id && !azureAdUserIds.includes(user.id) && user.licenses && user.licenses.length > 0,
	);
	const toUpdate = dbUsers.filter((user) => user.id && azureAdUserIds.includes(user.id));

	return {
		toAdd,
		toDelete,
		toFlagAsInactive,
		toUpdate,
	};
}

/**
 * Syncs the user table with an Azure AD group by adding, deleting, flagging as inactive, or updating users.
 * @param azureAdGroupUsers - The users from the Azure AD group
 * @param dbUsers - The users from the database
 */
export async function syncUserTableWithAzureAdGroup(
	azureAdGroupUsers: AzureAdGroupUser[],
	dbUsers: FilteredUsersForUserSync,
) {
	const transaction = await sequelize.transaction();
	try {
		if (dbUsers.toAdd.length > 0) {
			await UserModel.bulkCreate(
				dbUsers.toAdd.map((user) => ({
					id: user.id,
					name: user.displayName,
					active: true,
				})),
				{ transaction },
			);
		}
		if (dbUsers.toDelete.length > 0) {
			await UserModel.destroy({
				where: {
					id: dbUsers.toDelete.map((user) => user.id!),
				},
				transaction,
			});
		}
		if (dbUsers.toFlagAsInactive.length > 0) {
			await Promise.all(
				dbUsers.toFlagAsInactive.map(async (user) => {
					return UserModel.update({ active: false }, { where: { id: user.id }, transaction });
				}),
			);
		}
		if (dbUsers.toUpdate.length > 0) {
			await Promise.all(
				dbUsers.toUpdate.map(async (user) => {
					const azureAdUser = azureAdGroupUsers.find((u) => u.id === user.id);
					if (azureAdUser?.displayName !== user.name) {
						return UserModel.update(
							{ name: azureAdUser?.displayName },
							{ where: { id: user.id }, transaction },
						);
					}
				}),
			);
		}
		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
