import { writable } from 'svelte/store';

function createRequestStore() {
	const requestStore = writable({ selected: '' });

	return {
		subscribe: requestStore.subscribe,
		setRequest: (id: string) => {
			requestStore.update((store) => ({ ...store, selected: id }));
		}
	};
}

export const requestStore = createRequestStore();
