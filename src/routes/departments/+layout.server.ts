import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	let correspondingDepartment;

	const users = await locals.pb.collection('users').getFullList();


	if (locals.pb.authStore.baseModel.role == 'DEPARTMENT_LEADER') {
		correspondingDepartment = await locals.pb
			.collection('departments')
			.getFirstListItem(
				locals.pb.filter('leader = {:id}', { id: locals.pb.authStore.baseModel.id })
			);

		if (!correspondingDepartment) {
			console.log("kein dep")
			return redirect(303, "/departments");
		}

		if (Array.isArray(correspondingDepartment)) {
			throw redirect(303, "/departments/" + correspondingDepartment[0].id);
		}

		if (url.pathname !== "/departments/" + correspondingDepartment.id) {
			throw redirect(303, "/departments/" + correspondingDepartment.id);
		}
	}

	const departments = await locals.pb
		.collection('departments')
		.getFullList({ expand: 'teams,leader' });

	return { departments, users };
}) satisfies PageServerLoad;
