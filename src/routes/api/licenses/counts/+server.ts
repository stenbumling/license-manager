import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { getTodaysDateWithOffset } from '$lib/utils/date-utils';
import { json } from '@sveltejs/kit';
import { Op } from 'sequelize';

export async function GET() {
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

	// Wait for all counts to resolve before sending the response
	return json(
		{
			all: await allCount,
			inUse: await inUseCount,
			unassigned: await unassignedCount,
			nearExpiration: await nearExpirationCount,
			expired: await expiredCount,
		},
		{ status: 200 },
	);
}
