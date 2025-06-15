import { writable } from 'svelte/store';

const openDeleteDialogStore = writable({
	open: false,
	dialogTitle: '',
	callback: () => {}
});

function resetStore() {
	openDeleteDialogStore.set({
		open: false,
		dialogTitle: '',
		callback: () => {}
	});
}

export { openDeleteDialogStore, resetStore };
