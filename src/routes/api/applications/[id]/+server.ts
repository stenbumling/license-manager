import Application from '$lib/server/models/application-model';
import { json } from '@sveltejs/kit';

export async function PUT({ params, request }) {
	const id = params.id;
	const { updatedAt, ...app } = await request.json();

	const [affectedRows] = await Application.update(app, {
		where: { id, updatedAt },
	});

	if (affectedRows === 0) {
		// throw new APIError(
		//   409,
		//   'UpdateConflict',
		//   'Failed to update application. Application data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
		// );
		throw new Error(
			'Failed to update application. Application data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
		);
	}

	return json({ status: 204 });
}

export async function DELETE({ params }) {
	const id = params.id;

	const app = await Application.findByPk(id);
	if (!app) {
		// throw new APIError(
		// 	404,
		// 	'NotFound',
		// 	'Application not found. Please verify the provided ID is correct. If correct, the application might have been deleted or does not exist.',
		// );
		throw new Error(
			'Application not found. Please verify the provided ID is correct. If correct, the application might have been deleted or does not exist.',
		);
	} else if (app.dataValues.licenseAssociations > 0) {
		// throw new APIError(
		// 	409,
		// 	'DataDeletionError',
		// 	'Cannot delete application. There are licenses associated with this application. Please delete the licenses first.',
		// );
		throw new Error(
			'Cannot delete application. There are licenses associated with this application. Please delete the licenses first.',
		);
	}

	await app.destroy();
	return json({ status: 204 });
}
