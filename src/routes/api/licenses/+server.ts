import { sequelize } from '$lib/server/db.js';
import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { json } from '@sveltejs/kit';

export async function GET() {
	const licenses = await License.findAll({
		include: [
			{
				model: Application,
				as: 'application',
				attributes: { exclude: ['createdAt'] },
			},
			{
				model: User,
				attributes: { exclude: ['createdAt'] },
				through: { attributes: [] },
			},
		],
		order: [['createdAt', 'DESC']],
	});
	return json(licenses, { status: 200 });
}

export async function POST({ request }) {
	const transaction = await sequelize.transaction();
	try {
		const { users, ...licenseData } = await request.json();

		// Create the license and associate it with the provided users
		const createdLicense = await License.create(licenseData, { transaction });
		if (users && Array.isArray(users)) {
			const userIds = users.map((user) => user.id);
			await createdLicense.setUsers(userIds, { transaction });
		}

		// Update application license associations
		await Application.update(
			{
				licenseAssociations: sequelize.literal('licenseAssociations + 1'),
			},
			{
				where: { id: createdLicense.applicationId },
				transaction,
			},
		);

		await transaction.commit();
		return json({ status: 204 });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
