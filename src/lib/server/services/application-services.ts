import { sequelize } from '$lib/server/db';
import Application from '$lib/server/models/application-model';
import type { LicenseInstance } from '$lib/server/types/license-types';
import { error } from '@sveltejs/kit';
import type { Transaction } from 'sequelize';

export async function fetchAllApplications() {
	return Application.findAll({
		attributes: { exclude: ['createdAt'] },
		order: [['createdAt', 'DESC']],
	});
}

export async function createApplication(app: { name: string; link: string }) {
	if (!app.name) {
		error(400, {
			status: 400,
			type: 'DataCreationError',
			message: 'A valid application name is required.',
		});
	}
	const { dataValues } = await Application.create(app);
	return dataValues;
}

export async function updateApplication(
	id: string,
	app: { name: string; link: string },
	updatedAt: string,
) {
	const [affectedRows] = await Application.update(app, {
		where: { id, updatedAt },
	});

	if (affectedRows === 0) {
		error(409, {
			status: 409,
			type: 'UpdateConflict',
			message: 'Failed to update application because of data conflict.',
			details:
				'Application data may have been modified since it was last retrieved. Please retrieve the latest version and try again.',
		});
	}
}

export async function deleteApplication(id: string) {
	const app = await Application.findByPk(id);
	if (!app) {
		error(404, {
			status: 404,
			type: 'NotFound',
			message: 'Application could not be found.',
			details:
				'Please verify the provided ID is correct. If correct, the application might have been deleted or does not exist.',
		});
	} else if (app.dataValues.licenseAssociations > 0) {
		error(409, {
			status: 409,
			type: 'DataDeletionError',
			message: 'Cannot delete application.',
			details:
				'There are licenses associated with this application. Please delete the licenses first before trying to delete the application.',
		});
	}
	await app.destroy();
}

export async function updateLicenseAssociations(
	license: LicenseInstance,
	transaction: Transaction,
	change: '+' | '-' = '+',
) {
	await Application.update(
		{
			licenseAssociations: sequelize.literal(`licenseAssociations ${change} 1`),
		},
		{
			where: { id: license.applicationId },
			transaction,
		},
	);
	return null;
}
