import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params, parent }) => {
	const { departments } = await parent();

	const departmentId = params.departmentId;

	const department = departments.find((dep) => {
		return dep.id === departmentId;
	});

	if (!department) {
		return redirect(303, '/departments');
	}

	return { department };
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateDepartment: async ({ request, locals, params }) => {
		const keys = ['label', 'description', 'leader', 'teams', 'relatedPosts'];

		const form = await request.formData();
		const departmentId = params.departmentId as string;

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}

		try {
			await locals.pb.collection('departments').update(departmentId, data);
			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},
	createTeam: async ({ request, locals, params }) => {
		const keys = [
			'name',
			'description',
			'trainers',
			'events',
			'relatedPosts',
			'team_image',
			'department'
		];

		const form = await request.formData();
		const departmentId = params.departmentId as string;

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}

		// create pocketbase batch request

		let createdTeam;

		try {
			createdTeam = await locals.pb.collection('teams').create(data);

			await locals.pb.collection('departments').update(departmentId, {
				'teams+': [createdTeam.id]
			});

			return { success: true };
		} catch (error) {
			return { succes: false, error: error };
		}
	}
};
