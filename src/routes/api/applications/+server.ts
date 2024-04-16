import Application from '$lib/server/models/application-model';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	const applications = await Application.findAll({
		attributes: { exclude: ['createdAt'] },
		order: [['createdAt', 'DESC']],
	});
	return json(applications, { status: 200 });
}

export async function POST({ request }) {
	const app = await request.json();
	if (!app.name) {
		error(400, {
			status: 400,
			type: 'DataCreationError',
			message: 'A valid application name is required.',
		});
	}
	const { dataValues } = await Application.create(app);
	return json(dataValues, { status: 201 });
}
