import { get } from 'svelte/store';
import { confirmUpload, fileStore, uploadDialogStore } from './store';

function getFiles() {
	return new Promise((resolve, reject) => {
		const uploadDialogStoreState = get(uploadDialogStore);

		if (!uploadDialogStoreState) {
			uploadDialogStore.set(true);
		}

		const unsubscribe = confirmUpload.subscribe((confirmed) => {
			if (confirmed) {
				const fileStoreState = get(fileStore);

				if (fileStoreState.length === 0) {
					reject(new Error('No files'));
				} else {
					resolve(fileStoreState);
				}

				unsubscribe();
				confirmUpload.set(false);
			}
		});
	});
}

export function resetFileUpload() {
	fileStore.set([]);
	uploadDialogStore.set(false);
	confirmUpload.set(false);
}

export default getFiles;
