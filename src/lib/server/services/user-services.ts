import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { error } from '@sveltejs/kit';

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
