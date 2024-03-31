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
