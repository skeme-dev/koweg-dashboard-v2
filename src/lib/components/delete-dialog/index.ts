import { get } from 'svelte/store';
import { openDeleteDialogStore } from './store';

function requestDelete(dialogTitle: string, cb: () => any) {
	const state = get(openDeleteDialogStore);

	if (!state.open) {
		openDeleteDialogStore.set({
			open: true,
			dialogTitle: dialogTitle,
			callback: cb
		});
	}
}

export { requestDelete };
