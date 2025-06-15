import { writable } from 'svelte/store';

const fileStore = writable([]);

const uploadDialogStore = writable(false);

const confirmUpload = writable(false);

export { fileStore, uploadDialogStore, confirmUpload };
