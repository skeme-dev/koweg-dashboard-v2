import { fail } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	try {
		const posts = await locals.pb.collection('posts').getFullList();

		return { posts };
	} catch (error) {
		console.error(error);
		return fail(500);
	}
};
