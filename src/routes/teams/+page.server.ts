import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteTeam: async ({ locals, request }) => {
		const formData = await request.formData();

		if (!formData.has('teamId')) {
			return {
				status: 400,
				body: {
					message: 'Missing team id'
				}
			};
		}

		const teamId = formData.get('teamId') as string;

		try {
			await locals.pb.collection('teams').delete(teamId);
		} catch (error) {
			console.log(error);
		}
	}
};
