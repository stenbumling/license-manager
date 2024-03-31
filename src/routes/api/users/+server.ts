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

export async function POST({ request }) {
	const { name } = await request.json();
	if (!name) {
		// throw new APIError(400, 'InvalidRequestError', 'A valid user name is required.');
		throw new Error('A valid user name is required.');
	}
	const [user, created] = await User.findOrCreate({
		attributes: { exclude: ['createdAt'] },
		where: { name },
	});

	if (created) {
		return json({ user, created }, { status: 201 });
	} else {
		return json({ user, created }, { status: 200 });
	}
}
