import { get } from 'svelte/store';
import { picked, userPickerStore } from './store';

function getUser() {
	const userPickerStoreState = get(userPickerStore);

	if (!userPickerStoreState.open) {
		userPickerStore.set({
			open: true,
			selectedUsers: userPickerStoreState.selectedUsers
		});
	}

	return new Promise((resolve, reject) => {
		const userPickerStoreState = get(userPickerStore);

		if (!userPickerStoreState) {
			userPickerStore.set({
				open: true,
				selectedUsers: userPickerStoreState.selectedUsers
			});
		}

		const unsubscribe = picked.subscribe((state) => {
			if (state) {
				const userPickerSnapshot = get(userPickerStore);

				if (userPickerSnapshot.selectedUsers.length === 0) {
					reject(new Error('No users selected'));
				} else {
					resolve(userPickerSnapshot.selectedUsers);
				}
				unsubscribe();
				picked.set(false);
			}
		});
	});
}

export { getUser };
