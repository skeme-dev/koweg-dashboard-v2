import { writable } from 'svelte/store';

const userPickerStore = writable({
	open: false,
	selectedUsers: []
});

const picked = writable(false);

function resetStore() {
	userPickerStore.set({
		open: false,
		selectedUsers: []
	});
	picked.set(false);
}

export { userPickerStore, picked, resetStore };
