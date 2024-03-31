import Application from '$lib/server/models/application-model';
import { json } from '@sveltejs/kit';

export async function GET() {
	const applications = await Application.findAll({
		attributes: { exclude: ['createdAt'] },
		order: [['createdAt', 'DESC']],
	});
	return json(applications, { status: 200 });
}