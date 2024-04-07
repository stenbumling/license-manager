import { sequelize } from '$lib/server/db.js';
import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import type { LicenseInstance } from '$lib/server/types/license-types.js';
import type { UserInstance } from '$lib/server/types/user-types.js';
import { error, json } from '@sveltejs/kit';
import type { Transaction } from 'sequelize';

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
		error(404, {
			status: 404,
			type: 'NotFound',
			message:
				'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
		});
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
			error(409, {
				status: 409,
				type: 'UpdateConflict',
				message:
					'Failed to update license. License data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
			});
		}

		if (users && Array.isArray(users)) {
			await updateUserAssociations(users, id, transaction);
		}

		if (currentLicenseData.applicationId !== updatedLicenseData.applicationId) {
			await updateLicenseAssociations(currentLicenseData, transaction, '-');
			await updateLicenseAssociations(updatedLicenseData, transaction, '+');
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
			error(404, {
				status: 404,
				type: 'NotFound',
				message:
					'License not found. Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
			});
		}

		await updateLicenseAssociations(license, transaction, '-');

		await license.destroy({ transaction });

		await transaction.commit();
		return json({ status: 204 });
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

async function updateUserAssociations(
	users: UserInstance[],
	licenseId: string,
	transaction: Transaction,
) {
	const fetchedLicense = await License.findByPk(licenseId, { transaction });
	const userIds = users.map((user) => user.id);
	await fetchedLicense?.setUsers(userIds, { transaction });
}

async function updateLicenseAssociations(
	license: LicenseInstance,
	transaction: Transaction,
	change: '+' | '-' = '+',
) {
	return await Application.update(
		{
			licenseAssociations: sequelize.literal(`licenseAssociations ${change} 1`),
		},
		{
			where: { id: license.applicationId },
			transaction,
		},
	);
}
