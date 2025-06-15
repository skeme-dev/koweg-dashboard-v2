import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

let redirectTo: string | null;

export const load: PageServerLoad = async ({ url, locals }) => {
	if (locals.pb.authStore.isValid) {
		return redirect(303, '/');
	}

	redirectTo = url.searchParams.get('redirect');
};

export const actions: Actions = {
	login: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			await locals.pb.collection('users').authWithPassword(email, password);
		} catch (error) {
			console.log('Error:', error);

			if (error.status == 400) {
				return {
					error: true,
					message: 'Entweder E-Mail-Adresse oder Passwort ungültig.',
					email: email
				};
			}
		}

		console.log(redirectTo);

		if (redirectTo) {
			throw redirect(303, redirectTo);
		}
		throw redirect(303, '/');
	},
	logout: async ({ locals }) => {
		await locals.pb.authStore.clear();
		throw redirect(303, '/login');
	}
};
