import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { json } from '@sveltejs/kit';

export async function GET() {
	const users = await User.findAll({
		attributes: { exclude: ['createdAt'] },
		include: [
			{
				model: License,
				attributes: ['id'],
				through: { attributes: [] },
			},
		],
		order: [['name', 'ASC']],
	});
	return json(users, { status: 200 });
}
