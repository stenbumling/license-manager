import { Op, type Order } from 'sequelize';
import { sequelize } from '../db';
// import { APIError } from '../middlewares/errors/api-error';
import Application from '../models/application-model';
import type { Filter, SortBy, SortDirection, WhereOptionsWithSymbols } from '../types/query-types';
import { getFormattedDate } from '../utils/date-utils';

/*
 * These utility functions are used to construct the WHERE and ORDER BY clauses for
 * the License model. More specifically, it's used in the fetchByQuery function
 * inside the license-controller.ts file.
 */

export function constructWhereClause(filter: string, search: string): WhereOptionsWithSymbols {
	const where: WhereOptionsWithSymbols = {};
	const tomorrow = getFormattedDate(1);
	const expirationWarningDate = getFormattedDate(14);

	// Filter logic
	switch (filter as Filter) {
		case 'all':
			break;
		case 'assigned':
			where['$Users.id$'] = { [Op.not]: null };
			break;
		case 'unassigned':
			where['$Users.id$'] = { [Op.is]: null };
			break;
		case 'near-expiration':
			where.expirationDate = { [Op.and]: { [Op.gte]: tomorrow, [Op.lte]: expirationWarningDate } };
			break;
		case 'expired':
			where.expirationDate = { [Op.lt]: tomorrow };
			break;
		default:
		// throw new APIError(
		// 	400,
		// 	'InvalidQueryParameter',
		// 	'Invalid filter was provided and the request was aborted.',
		// );
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

export function constructOrderClause(sortBy: SortBy, sortDirection: SortDirection) {
	let order: Order;

	switch (sortBy) {
		case 'application':
			order = [[{ model: Application, as: 'application' }, 'name', sortDirection]];
			break;
		case 'contactPerson':
			order = [['contactPerson', sortDirection]];
			break;
		// Sort by the *number* of users associated with the license, not the users themselves
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
			order = [[sortBy, sortDirection]];
			break;
	}

	return order;
}
