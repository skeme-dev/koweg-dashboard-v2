import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import slugify from 'slugify';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updatePost: async ({ locals, params, request }) => {
		const keys = [
			'title',
			'description',
			'heroImage',
			'featureImages',
			'author',
			'publishDate',
			'isPublished'
		];

		const form = await request.formData();
		const { postId } = params as { postId: string };

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}

		if (form.has('title')) {
			data['slug'] = slugify(data['title'], { lower: true });
		}

		if (form.has('content')) {
			data['content'] = JSON.parse(form.get('content'));
		}

		try {
			await locals.pb.collection('posts').update(postId, data);
			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}
};
