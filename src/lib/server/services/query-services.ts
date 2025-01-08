import { sequelize } from '$lib/server/db';
import ApplicationModel from '$lib/server/models/application-model';
import type {
	FilterQuery,
	SortColumn,
	SortDirection,
	WhereOptionsWithSymbols,
} from '$lib/types/query-types';
import { getTodaysDateWithOffset } from '$lib/utils/date-utils';
import { error } from '@sveltejs/kit';
import { Op, type Order } from 'sequelize';

/**
 * Constructs the WHERE clause for the License model based on the filter and search query parameters.
 * @param filter The filter query parameter
 * @param search The search query parameter
 * @returns The WHERE clause for the License model
 */
export function constructWhereClause(filter: FilterQuery, search: string): WhereOptionsWithSymbols {
	const where: WhereOptionsWithSymbols = {};
	const tomorrow = getTodaysDateWithOffset(1);
	const expirationWarningDate = getTodaysDateWithOffset(14);

	// Filter logic
	switch (filter) {
		case 'all':
			break;
		case 'assigned':
			where['$Users.id$'] = { [Op.not]: null };
			break;
		case 'unassigned':
			where['$Users.id$'] = { [Op.is]: null };
			break;
		case 'inactive':
			where.status = 'Inactive';
			break;
		case 'near-expiration':
			where.expirationDate = { [Op.and]: { [Op.gte]: tomorrow, [Op.lte]: expirationWarningDate } };
			break;
		case 'expired':
			where.expirationDate = { [Op.lt]: tomorrow };
			break;
		default:
			error(400, {
				status: 400,
				type: 'InvalidQueryParameter',
				message: 'Invalid filter was provided and the request was aborted.',
			});
	}

	// Search logic
	if (search as string) {
		const escapedSearch = sequelize.escape(`%${search}%`);

		where[Op.or] = [
			{ contactPerson: { [Op.like]: sequelize.literal(`${escapedSearch}`) } },
			{ comment: { [Op.like]: sequelize.literal(`${escapedSearch}`) } },
			{ category: { [Op.like]: sequelize.literal(`${escapedSearch}`) } },
			{ additionalContactInfo: { [Op.like]: sequelize.literal(`${escapedSearch}`) } },
			{ status: { [Op.like]: sequelize.literal(`${escapedSearch}`) } },
			sequelize.literal(
				`(SELECT COUNT(*) FROM applications WHERE applications.id = license.applicationId AND applications.name LIKE ${escapedSearch}) > 0`,
			),
			sequelize.literal(
				`(SELECT COUNT(*) FROM users INNER JOIN UserLicense ON users.id = UserLicense.userId WHERE UserLicense.licenseId = license.id AND users.name LIKE ${escapedSearch}) > 0`,
			),
		];
	}

	return where;
}

/**
 * Constructs the ORDER BY clause for the License model based on the sort column and sort direction parameters.
 * @param sortColumn The sort column query parameter
 * @param sortDirection The sort direction query parameter
 * @returns The ORDER BY clause for the License model
 */
export function constructOrderClause(sortColumn: SortColumn, sortDirection: SortDirection) {
	let order: Order;

	switch (sortColumn) {
		case 'application':
			order = [[{ model: ApplicationModel, as: 'application' }, 'name', sortDirection]];
			break;
		case 'contactPerson':
			order = [['contactPerson', sortDirection]];
			break;
		// Sorts by the *number* of users associated with the license, not by user name
		case 'users':
			order = [
				[
					sequelize.literal(`(
					SELECT COUNT(*)
					FROM "UserLicense" AS ul
					WHERE
						ul."licenseId" = "License"."id"
				)`),
					sortDirection,
				],
			];
			break;
		case 'expirationDate':
			order = [['expirationDate', sortDirection]];
			break;
		default:
			order = [[sortColumn, sortDirection]];
			break;
	}

	return order;
}
