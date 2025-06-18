import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const load = (async ({ locals }) => {
	const users = await locals.pb.collection('users').getFullList();

	return { users };
}) satisfies PageServerLoad;

export const actions = {
	createUser: async ({ locals, request }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const name = formData.get('name') as string;
		const role = formData.get('role') as string;
		const password = crypto.randomUUID();

		if (!email || !name || !role) {
			return fail(400, { message: 'Email, name, and role are required' });
		}

		try {
			await locals.pb.collection('users').create({
				email,
				name,
				role,
				password,
				passwordConfirm: password,
				invited: false,
				emailVisibility: true
			});

			return { success: true };
		} catch (error) {
			console.error('error creating user');
			return fail(500, { message: 'Failed to create user' });
		}
	},
	invite: async ({ locals, request }) => {
		const formData = await request.formData();

		const userId = formData.get('userId') as string;

		if (!userId) {
			fail(404, { message: 'User ID is required' });
		}

		try {
			locals.pb.send(`/invite`, {
				method: 'POST',
				body: JSON.stringify({
					userId: userId
				})
			});

			return { success: true, message: 'Invitation sent successfully' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to send invitation to server' });
		}
	}
};
