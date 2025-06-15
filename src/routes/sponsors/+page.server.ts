import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const sponsors = await locals.pb.collection('sponsors').getFullList();

    return { sponsors };
}) satisfies PageServerLoad;

export const actions = {
	createSponsor: async ({ locals, request }) => {
		const keys = ['name', 'logo', 'link', 'main_sponsor'];
		const form = await request.formData();

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
        }
        
        try {
			const created = await locals.pb.collection('sponsors').create(data);
			return { sponsorId: created.id };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},

	updateSponsor: async ({ locals, request }) => {
		const keys = ['id', 'name', 'logo', 'link', 'main_sponsor'];
		const form = await request.formData();

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}
		
		try {
			await locals.pb.collection('sponsors').update(data.id, data);
			return { sponsorId: data.id };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},	

	deleteSponsor: async ({ locals, request }) => {
		const form = await request.formData();
		const id = form.get('id');

		if (!id) {
			return { error: true };
		}

		try {
			await locals.pb.collection('sponsors').delete(id);
			return { sponsorId: id };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	}
}