import type { Actions } from '@sveltejs/kit';
import slugify from 'slugify';

export const actions: Actions = {
	createDepartment: async ({ request, locals }) => {
		const keys = ['label', 'description', 'leader', 'teams', 'relatedPosts'];
		const form = await request.formData();

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}

		data["slug"] = slugify(form.get("label") as string);

		try {
			const created = await locals.pb.collection('departments').create(data);
			return { departmentId: created.id };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}
};
