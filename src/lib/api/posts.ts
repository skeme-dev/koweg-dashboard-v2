import { sendFormData } from './helpers';

interface Post {
	title?: string;
	description?: string;
	heroImage?: File;
	featureImages?: File[];
	author?: string;
	publishDate?: Date;
	content: JSON;
	isPublished?: boolean;
}

function createPostByMetaData(data: Post, cb: (res: any) => any, onError: (error: Error) => any) {
	// if (!validation.success) {
	// 	return onError(new Error(validation.error.message));
	// }

	sendFormData('/posts?/createPost', data)
		.then((data) => {
			return cb(data);
		})
		.catch((error) => {
			return onError(error);
		});
}

function updatePost(postId: string, data: Post, cb: () => any, onError: (error: Error) => any) {
	if (!postId) {
		return onError(new Error('Berichte ID ist erforderlich'));
	}

	// Update post meta

	sendFormData('/posts/edit/' + postId + '?/updatePost', data)
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(error);
		});
}

export { createPostByMetaData, updatePost };
