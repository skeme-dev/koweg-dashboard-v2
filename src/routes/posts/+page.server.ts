import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import slugify from 'slugify';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createPost: async ({ request, locals }) => {
		const formData = await request.formData();
		const keys = ['title', 'description', 'heroImage'];

		let data = {};

		for (const key of keys) {
			data[key] = formData.get(key);
		}

		if (Object.keys(data).length < 3) {
			return error(400, {
				message: 'Missing data'
			});
		}

		data['slug'] = slugify(data['title'], { lower: true });

		try {
			const created = await locals.pb.collection('posts').create(data);
			return { postId: created.id };
		} catch (err) {
			console.log(err);

			return error(400, { message: err.message });
		}
	}
};
