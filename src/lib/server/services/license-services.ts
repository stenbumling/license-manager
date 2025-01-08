import { sequelize } from '$lib/server/db';
import ApplicationModel from '$lib/server/models/application-model';
import LicenseModel from '$lib/server/models/license-model';
import UserModel from '$lib/server/models/user-model';
import { updateLicenseAssociations } from '$lib/server/services/application-services';
import { constructOrderClause, constructWhereClause } from '$lib/server/services/query-services';
import type { LicenseCounts, LicenseData, LicenseInstance } from '$lib/types/license-types';
import type { FilterQuery, SortColumn, SortDirection } from '$lib/types/query-types';
import type { UserData } from '$lib/types/user-types';
import { getTodaysDateWithOffset } from '$lib/utils/date-utils';
import { error } from '@sveltejs/kit';
import type { Transaction } from 'sequelize';
import { Op } from 'sequelize';

export async function fetchLicensesByQuery(
	filter: FilterQuery,
	search: string,
	sortColumn: SortColumn,
	sortDirection: SortDirection,
): Promise<LicenseInstance[]> {
	/** The WHERE clause for the License model */
	const where = constructWhereClause(filter, search);

	/** The ORDER clause for the License model */
	const order = constructOrderClause(sortColumn, sortDirection);

	const licenses = await LicenseModel.findAll({
		where,
		include: [
			{
				model: ApplicationModel,
				as: 'application',
				attributes: { exclude: ['createdAt'] },
			},
			{
				model: UserModel,
				attributes: { exclude: ['createdAt'] },
				through: { attributes: [] },
			},
		],
		order,
	});
	return licenses;
}

export async function getLicenseCounts(): Promise<LicenseCounts> {
	const tomorrow = getTodaysDateWithOffset(1);
	const expirationWarningDate = getTodaysDateWithOffset(14);

	const allCount = LicenseModel.count();
	const inUseCount = LicenseModel.count({
		include: [
			{
				model: UserModel,
				attributes: [],
				through: { attributes: [] },
				required: true,
			},
		],
		distinct: true,
		col: 'id',
	});
	const unassignedCount = LicenseModel.count({
		where: { '$Users.id$': { [Op.is]: null } },
		include: [
			{
				model: UserModel,
				attributes: [],
				through: { attributes: [] },
				required: false,
			},
		],
	});
	const inactiveCount = LicenseModel.count({ where: { status: 'Inactive' } });
	const nearExpirationCount = LicenseModel.count({
		where: {
			expirationDate: {
				[Op.and]: {
					[Op.gte]: tomorrow,
					[Op.lte]: expirationWarningDate,
				},
			},
		},
	});
	const expiredCount = LicenseModel.count({
		where: { expirationDate: { [Op.lt]: tomorrow } },
	});

	return {
		all: await allCount,
		inUse: await inUseCount,
		unassigned: await unassignedCount,
		inactive: await inactiveCount,
		nearExpiration: await nearExpirationCount,
		expired: await expiredCount,
	};
}

export async function getLicense(licenseId: string) {
	const license = await LicenseModel.findByPk(licenseId, {
		include: [
			{
				model: ApplicationModel,
				as: 'application',
				attributes: { exclude: ['createdAt'] },
			},
			{
				model: UserModel,
				attributes: { exclude: ['createdAt'] },
				through: { attributes: [] },
			},
		],
	});

	if (!license) {
		error(404, {
			status: 404,
			type: 'NotFound',
			message: 'License could not be found.',
			details:
				'Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
		});
	}
	return license;
}

export async function createLicense(license: LicenseData) {
	const transaction = await sequelize.transaction();
	try {
		const { users } = license;
		const createdLicense = await LicenseModel.create(license, { transaction });

		if (users && createdLicense) {
			await updateUserAssociations(users, createdLicense, transaction);
		}

		await updateLicenseAssociations(createdLicense.applicationId, transaction, '+');

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

export async function updateLicense(
	licenseId: string,
	data: { updatedLicense: LicenseData; currentLicense: LicenseData },
) {
	const transaction = await sequelize.transaction();
	try {
		const { users, updatedAt, ...updatedLicenseData } = data.updatedLicense;
		const { ...currentLicenseData } = data.currentLicense;

		// Update the license data if it has not been modified since it was last retrieved
		const [affectedRows] = await LicenseModel.update(updatedLicenseData, {
			where: {
				id: licenseId,
				updatedAt,
			},
			transaction,
		});
		if (affectedRows === 0) {
			error(409, {
				status: 409,
				type: 'UpdateConflict',
				message: 'Failed to update license because of data conflict.',
				details:
					'License data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
			});
		}

		if (users) {
			const fetchedLicense = await LicenseModel.findByPk(licenseId, { transaction });
			if (fetchedLicense) await updateUserAssociations(users, fetchedLicense, transaction);
		}

		if (currentLicenseData.applicationId !== updatedLicenseData.applicationId) {
			await updateLicenseAssociations(currentLicenseData.applicationId, transaction, '-');
			await updateLicenseAssociations(updatedLicenseData.applicationId, transaction, '+');
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

export async function updateUserAssociations(
	users: UserData[],
	license: LicenseInstance,
	transaction: Transaction,
) {
	const userIds = users.map((user) => user.id);
	await license.setUsers(userIds, { transaction });
	return null;
}

export async function deleteLicense(licenseId: string) {
	const transaction = await sequelize.transaction();
	try {
		const license = await LicenseModel.findByPk(licenseId, { transaction });
		if (!license) {
			error(404, {
				status: 404,
				type: 'NotFound',
				message: 'License could not be found.',
				details:
					'Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
			});
		}

		await updateLicenseAssociations(license.applicationId, transaction, '-');

		await license.destroy({ transaction });

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
