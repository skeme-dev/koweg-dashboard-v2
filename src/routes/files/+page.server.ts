import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals }) => {
	const files = await locals.pb.collection("_files").getFullList();
	
	// const response = await fetch(`${PUBLIC_POCKETBASE_URL}/public/meta.txt`, {
	// 	method: "GET"
	// })

	// if (!response.ok) {
	// 	return {
	// 		files: [],
	// 		error: true
	// 	}
	// }

	// const text = await response.text();

	// const t = text.split('\n').filter(line => line.length > 0);

	// const resp = await fetch(`${PUBLIC_POCKETBASE_URL}/public/downloads/${t[1]}`, {
	// 	method: "GET"	
	// })

	// const blob = await resp.blob();
	// const file = new File([blob], t[0])

	return {
		files
	};
}) satisfies PageServerLoad;


export const actions = {
	uploadFile: async ({ request, locals }) => {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			fail(400, { message: "No file provided" });
		}

		if (file.size > 10 * 1024 * 1024) {
			return fail(400, { message: "File is too large to upload" });
		}

		formData.append("name", file.name);
		formData.append("uploadedBy", locals.pb.authStore.model?.id || "");

		try {
			await locals.pb.collection("_files").create(formData);

			return { success: true, message: "File uploaded successfully" };
		} catch (error) {
			console.error(error);
			return fail(500, { message: "Failed to upload file" });
		}
	},
	deleteFile: async ({ request, locals }) => {
		const formData = await request.formData();
		const fileId = formData.get("fileId") as string;

		if (!fileId) {
			return fail(400, { message: "No file ID provided" });
		}

		try {
			await locals.pb.collection("_files").delete(fileId);
			return { success: true, message: "File deleted successfully" };
		} catch (error) {
			console.error(error);
			return fail(500, { message: "Failed to delete file" });
		}
	}
}