import Application from '$lib/server/models/application-model';
import { json } from '@sveltejs/kit';

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
		// throw new APIError(400, 'DataCreationError', 'A valid application name is required.');
		throw new Error('A valid application name is required.');
	}
	const newApplication = await Application.create(app);

	return json(newApplication.dataValues, { status: 201 });
}
