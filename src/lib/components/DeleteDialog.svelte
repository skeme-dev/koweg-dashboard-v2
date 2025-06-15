<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let dialogDescription = '';
	export let dialogTitle = 'Bist du sicher?';
	export let open = false;
	export let onDelete;
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{dialogTitle}</AlertDialog.Title>
			<AlertDialog.Description>
				{dialogDescription}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => onDelete()}>Löschen</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
