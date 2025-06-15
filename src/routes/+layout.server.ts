import type { LayoutLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: LayoutLoad = (async ({ url, locals }) => {
	if (url.pathname.startsWith("/welcome")) {
		return;
	}
	
	if (!url.pathname.startsWith('/login') && !locals.pb.authStore.isValid) {
		throw redirect(303, `/login?redirect=${url.pathname}`);
	}

	const permissions = await locals.pb.collection("permissions").getFullList();
	const user = locals.pb.authStore.record;


	if (permissions.length === 0) {
		return error(500, {
			message: "No permissions found. Please contact support.",
			code: "NO_PERMISSIONS"
		})
	}


	return { user, permissions };
}) satisfies LayoutLoad;
