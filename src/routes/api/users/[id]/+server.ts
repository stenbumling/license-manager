import User from '$lib/server/models/user-model';
import { json } from '@sveltejs/kit';

export async function DELETE({ params }) {
	const id = params.id;

	const user = await User.findByPk(id);
	if (!user) {
		// throw new APIError(
		// 	404,
		// 	'NotFound',
		// 	'User not found. Please verify the provided ID is correct. If correct, the user might have been deleted or does not exist.',
		// );
		throw new Error(
			'User not found. Please verify the provided ID is correct. If correct, the user might have been deleted or does not exist.',
		);
	}
	await user.destroy();
	return json({ status: 204 });
}
