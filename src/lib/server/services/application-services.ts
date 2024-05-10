import type { ApplicationData } from '$lib/types/application-types';
import { error } from '@sveltejs/kit';
import type { Transaction } from 'sequelize';
import { sequelize } from '../db';
import ApplicationModel from '../models/application-model';

export async function fetchAllApplications() {
	return ApplicationModel.findAll({
		attributes: { exclude: ['createdAt'] },
		order: [['createdAt', 'DESC']],
	});
}

export async function createApplication(app: ApplicationData) {
	if (!app.name) {
		error(400, {
			status: 400,
			type: 'DataCreationError',
			message: 'A valid application name is required.',
		});
	}
	await ApplicationModel.create(app);
}

export async function updateApplication(id: string, app: ApplicationData) {
	const { updatedAt } = app;
	const [affectedRows] = await ApplicationModel.update(app, {
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
	const app = await ApplicationModel.findByPk(id);
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
	appId: string,
	transaction: Transaction,
	operator: '+' | '-' = '+',
) {
	await ApplicationModel.update(
		{
			licenseAssociations: sequelize.literal(`licenseAssociations ${operator} 1`),
		},
		{
			where: { id: appId },
			transaction,
		},
	);
}
