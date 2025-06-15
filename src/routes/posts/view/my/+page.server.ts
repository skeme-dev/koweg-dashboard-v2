import type { PageServerLoad } from './$types';

export const load = (async ({ parent, locals }) => {
	let { posts } = await parent();

	posts = posts.filter((post) => post.author === locals.pb.authStore.record?.id);

	return { posts };
}) satisfies PageServerLoad;
