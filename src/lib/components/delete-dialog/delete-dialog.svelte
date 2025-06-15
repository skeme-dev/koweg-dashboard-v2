<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { openDeleteDialogStore, resetStore } from './store';

	import * as AlertDialog from '../../components/ui/alert-dialog';

	let open: boolean = false;
	let state;

	onMount(() => {
		openDeleteDialogStore.subscribe((value) => {
			if (value.open) {
				open = true;
				state = { dialogTitle: value.dialogTitle, callback: value.callback };
			} else {
				open = false;
			}
		});
	});

	onDestroy(() => {
		resetStore();
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{state.dialogTitle}</AlertDialog.Title>
			<AlertDialog.Description>
				Diese Aktion kann nicht rückgängig gemacht werden. Möchten Sie fortfahren?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				onclick={() => {
					resetStore();
				}}>Abbrechen</AlertDialog.Cancel
			>
			<AlertDialog.Action
				onclick={() => {
					state.callback();
					resetStore();
				}}>Löschen</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
