import License from '$lib/server/models/license-model';
import User from '$lib/server/models/user-model';
import { error, json } from '@sveltejs/kit';

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
		error(400, {
			status: 400,
			type: 'InvalidRequestError',
			message: 'A valid user name is required.',
		});
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
