import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const requests = await locals.pb.collection('contact_attempts').getFullList();

	return { requests };
}) satisfies PageServerLoad;
