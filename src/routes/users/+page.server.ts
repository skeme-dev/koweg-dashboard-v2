import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const load = (async ({ locals }) => {
	const users = await locals.pb.collection('users').getFullList();

	return { users };
}) satisfies PageServerLoad;

export const actions = {
	invite: async ({ locals, request }) => {
		const formData = await request.formData();

		const userId = formData.get("userId") as string;

		if (!userId) {
			fail(404, { message: "User ID is required"})
		}

		try {
			locals.pb.send(`/invite`, {
				method: "POST",
				body: JSON.stringify({
					userId: userId
				})
			})

			return { success: true, message: "Invitation sent successfully" };
		} catch (error) {
			console.error(error);
			return fail(500, { message: "Failed to send invitation to server" });
		}
	}
}