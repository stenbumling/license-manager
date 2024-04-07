import { sequelize } from '$lib/server/db.js';
import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import {
	updateLicenseAssociations,
	updateUserAssociations,
} from '$lib/server/utils/associations-utils.js';
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

		const createdLicense = await License.create(licenseData, { transaction });

		if (users && Array.isArray(users) && createdLicense) {
			await updateUserAssociations(users, createdLicense, transaction);
		}

		await updateLicenseAssociations(createdLicense, transaction, '+');

		await transaction.commit();
		return json({ status: 204 });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
