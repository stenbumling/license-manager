import { sequelize } from '$lib/server/db.js';
import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const id = params.id;

	const license = await License.findByPk(id, {
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
	});

	if (!license) {
		// throw new APIError(
		// 	404,
		// 	'NotFound',
		// 	'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
		// );
		throw new Error(
			'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
		);
	}
	return json(license, { status: 200 });
}

export async function PUT({ params, request }) {
	const transaction = await sequelize.transaction();
	try {
		const id = params.id;
		const data = await request.json();
		const { users, updatedAt, ...updatedLicenseData } = data.updatedLicense;
		const { currentLicense: currentLicenseData } = data;

		// Update the license data if it has not been modified since it was last retrieved
		const [affectedRows] = await License.update(updatedLicenseData, {
			where: {
				id,
				updatedAt,
			},
			transaction,
		});
		if (affectedRows === 0) {
			// throw new APIError(
			// 	409,
			// 	'UpdateConflict',
			// 	'Failed to update license. License data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
			// );
			throw new Error(
				'Failed to update license. License data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
			);
		}

		// Update the license and associate it with the provided users
		const fetchedLicense = await License.findByPk(id, { transaction });
		if (users && Array.isArray(users)) {
			const userIds = users.map((user) => user.id);
			await fetchedLicense?.setUsers(userIds, { transaction });
		}

		// Update applications license associations
		if (currentLicenseData.applicationId !== updatedLicenseData.applicationId) {
			await Application.update(
				{
					licenseAssociations: sequelize.literal('licenseAssociations - 1'),
				},
				{
					where: { id: currentLicenseData.applicationId },
					transaction,
				},
			);
			await Application.update(
				{
					licenseAssociations: sequelize.literal('licenseAssociations + 1'),
				},
				{
					where: { id: updatedLicenseData.applicationId },
					transaction,
				},
			);
		}

		await transaction.commit();
		return json({ status: 204 });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

export async function DELETE({ params }) {
	const transaction = await sequelize.transaction();
	try {
		const id = params.id;

		const license = await License.findByPk(id, { transaction });
		if (!license) {
			// throw new APIError(
			// 	404,
			// 	'NotFound',
			// 	'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
			// );
			throw new Error(
				'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
			);
		}

		// Update application license associations
		await Application.update(
			{
				licenseAssociations: sequelize.literal('licenseAssociations - 1'),
			},
			{
				where: { id: license.applicationId },
				transaction,
			},
		);

		await license.destroy({ transaction });

		await transaction.commit();
		return json({ status: 204 });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
