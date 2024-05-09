import { sequelize } from '$lib/server/db';
import Application from '$lib/server/models/application-model';
import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { updateLicenseAssociations } from '$lib/server/services/application-services';
import { constructOrderClause, constructWhereClause } from '$lib/server/services/query-services';
import type { LicenseInstance } from '$lib/server/types/license-types';
import type { Filter, SortBy, SortDirection } from '$lib/server/types/query-types';
import type { UserInstance } from '$lib/server/types/user-types';
import { getTodaysDateWithOffset } from '$lib/utils/date-utils';
import { error } from '@sveltejs/kit';
import type { Transaction } from 'sequelize';
import { Op } from 'sequelize';

export async function fetchLicensesByQuery(
	filter: Filter,
	search: string,
	sortBy: SortBy,
	sortDirection: SortDirection,
) {
	// Selects licenses based on the filter and search query parameters
	const where = constructWhereClause(filter, search);

	// Sorts the licenses based on the sortBy and sortDirection query parameters
	const order = constructOrderClause(sortBy, sortDirection);

	const licenses = await License.findAll({
		where,
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
		order,
	});
	return licenses;
}

export async function getLicenseCounts() {
	const tomorrow = getTodaysDateWithOffset(1);
	const expirationWarningDate = getTodaysDateWithOffset(14);

	const allCount = License.count();
	const inUseCount = License.count({
		include: [
			{
				model: User,
				attributes: [],
				through: { attributes: [] },
				required: true,
			},
		],
		distinct: true,
		col: 'id',
	});
	const unassignedCount = License.count({
		where: { '$Users.id$': { [Op.is]: null } },
		include: [
			{
				model: User,
				attributes: [],
				through: { attributes: [] },
				required: false,
			},
		],
	});
	const nearExpirationCount = License.count({
		where: {
			expirationDate: {
				[Op.and]: {
					[Op.gte]: tomorrow,
					[Op.lte]: expirationWarningDate,
				},
			},
		},
	});
	const expiredCount = License.count({
		where: { expirationDate: { [Op.lt]: tomorrow } },
	});

	return {
		all: await allCount,
		inUse: await inUseCount,
		unassigned: await unassignedCount,
		nearExpiration: await nearExpirationCount,
		expired: await expiredCount,
	};
}

export async function getLicense(licenseId: string) {
	const license = await License.findByPk(licenseId, {
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
			message: 'License could not be found.',
			details:
				'Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
		});
	}
	return license;
}

export async function createLicense(license: LicenseInstance, users: UserInstance[]) {
	const transaction = await sequelize.transaction();
	try {
		const createdLicense = await License.create(license, { transaction });

		if (users && Array.isArray(users) && createdLicense) {
			await updateUserAssociations(users, createdLicense, transaction);
		}

		await updateLicenseAssociations(createdLicense, transaction, '+');

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

export async function updateLicense(
	licenseId: string,
	data: { updatedLicense: LicenseInstance; currentLicense: LicenseInstance },
) {
	const transaction = await sequelize.transaction();
	try {
		const { users, updatedAt, ...updatedLicenseData } = data.updatedLicense;
		const { currentLicense: currentLicenseData } = data;

		// Update the license data if it has not been modified since it was last retrieved
		const [affectedRows] = await License.update(updatedLicenseData, {
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

		if (users && Array.isArray(users)) {
			const fetchedLicense = await License.findByPk(licenseId, { transaction });
			if (fetchedLicense) await updateUserAssociations(users, fetchedLicense, transaction);
		}

		if (currentLicenseData.applicationId !== updatedLicenseData.applicationId) {
			await updateLicenseAssociations(currentLicenseData as LicenseInstance, transaction, '-');
			await updateLicenseAssociations(updatedLicenseData as LicenseInstance, transaction, '+');
		}

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

export async function updateUserAssociations(
	users: UserInstance[],
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
		const license = await License.findByPk(licenseId, { transaction });
		if (!license) {
			error(404, {
				status: 404,
				type: 'NotFound',
				message: 'License could not be found.',
				details:
					'Please verify the provided ID is correct. If correct, the license might have been deleted or does not exist.',
			});
		}

		await updateLicenseAssociations(license, transaction, '-');

		await license.destroy({ transaction });

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}
