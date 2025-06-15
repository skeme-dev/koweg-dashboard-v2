import { fail, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params, parent, fetch }) => {
	const postId = params.postId;

	const { posts } = await parent();

	const currentPost = posts?.find((post) => post.id === postId);

	if (!currentPost) {
		return redirect(308, '/posts/view/my');
	}

	if (currentPost.heroImage) {
		const response = await fetch(locals.pb.files.getURL(currentPost, currentPost.heroImage));
		const blob = await response.blob();

		const file = new File([blob], currentPost.heroImage);
		const arrayBuffer = await file.arrayBuffer();

		const serializiableFileObject = {
			lastModified: file.lastModified,
			name: file.name,
			size: file.size,
			type: file.type,
			content: arrayBuffer
		};

		currentPost['heroImageFileObject'] = serializiableFileObject;
	} else {
		currentPost['heroImageFileObject'] = null;
	}

	return { currentPost };
};
