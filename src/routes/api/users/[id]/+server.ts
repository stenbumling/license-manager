import User from '$lib/server/models/user-model';
import { error } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const id = params.id;

	const user = await User.findByPk(id);
	if (!user) {
		error(404, {
			status: 404,
			type: 'NotFound',
			message: 'User could not be found.',
			details:
				'Please verify the provided ID is correct. If correct, the user might have been deleted or does not exist.',
		});
	}
	await user.destroy();
	return new Response(null, { status: 204 });
}
