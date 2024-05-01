import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { error } from '@sveltejs/kit';
import { sequelize } from '../db';
import type { AzureAdGroupUser, UserAttributes } from '../types/user-types';

export async function getAzureAdGroupMembers(token: string) {
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
		const err = await response.json();
		console.error('Azure AD Error:', err);
		error(500, {
			status: 500,
			type: 'Azure AD Error',
			message: 'Failed to retrieve group members',
		});
	}
}

export async function getUsersFromDatabase() {
	const userInstances = await User.findAll({
		attributes: { exclude: ['createdAt'] },
		include: [
			{
				model: License,
				attributes: ['id'],
				through: { attributes: [] },
			},
		],
		order: [['name', 'ASC']],
	});
	const users = userInstances.map((user) => user.toJSON());
	return users;
}

export async function syncUserTableWithAzureADGroup(
	azureAdGroupUsers: AzureAdGroupUser[],
	dbUsers: {
		toAdd: AzureAdGroupUser[];
		toDelete: UserAttributes[];
		toFlagAsInactive: UserAttributes[];
		toUpdate: UserAttributes[];
	},
) {
	const transaction = await sequelize.transaction();
	try {
		if (dbUsers.toAdd.length > 0) {
			await User.bulkCreate(
				dbUsers.toAdd.map((user) => ({
					id: user.id,
					name: user.displayName,
				})),
				{ transaction },
			);
		}
		if (dbUsers.toDelete.length > 0) {
			await User.destroy({
				where: {
					id: dbUsers.toDelete.map((user) => user.id!),
				},
				transaction,
			});
		}
		if (dbUsers.toFlagAsInactive.length > 0) {
			await Promise.all(
				dbUsers.toFlagAsInactive.map(async (user) => {
					return User.update({ active: false }, { where: { id: user.id }, transaction });
				}),
			);
		}
		if (dbUsers.toUpdate.length > 0) {
			await Promise.all(
				dbUsers.toUpdate.map(async (user) => {
					const azureAdUser = azureAdGroupUsers.find((u) => u.id === user.id);
					if (azureAdUser?.displayName !== user.name) {
						return User.update(
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

/**
 * Used with syncUserTableWithAzureADGroup to determine which users need to be added, deleted, flagged, or updated.
 * @param azureAdGroupUsers
 * @param dbUsers
 */
export function filterUsers(azureAdGroupUsers: AzureAdGroupUser[], dbUsers: UserAttributes[]) {
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

	const filteredUsers = {
		toAdd,
		toDelete,
		toFlagAsInactive,
		toUpdate,
	};
	return filteredUsers;
}
