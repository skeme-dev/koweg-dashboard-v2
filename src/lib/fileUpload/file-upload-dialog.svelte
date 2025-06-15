<script lang="ts">
	import { onDestroy } from 'svelte';

	import Button from '../components/ui/button/button.svelte';
	import * as Dialog from '../components/ui/dialog';

	import { confirmUpload, fileStore, uploadDialogStore } from './store';
	import { resetFileUpload } from '.';
	import FileUploadCropper from './file-upload-cropper.svelte';

	let open: boolean = $state.raw(false);
	let files: File[] = $state.raw([]);

	let cropping: boolean = $state.raw(false);

	// svelte-ignore non_reactive_update
	let getCroppedImage: (() => Promise<unknown>) | undefined;

	function handleInputChange(e) {
		if (e.target?.files.length === 0) return;
		files = e.target?.files;
	}

	const unsubscribe = uploadDialogStore.subscribe((value) => {
		if (value) {
			open = true;
		} else {
			open = false;
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<Dialog.Root
	bind:open
	onOpenChange={(opened) => {
		if (!opened) {
			resetFileUpload();
		}
	}}
>
	<Dialog.Content class={cropping ? 'max-w-fit min-h-[75%]' : 'max-w-[50%]'}>
		<Dialog.Header>
			<Dialog.Title>Dateien hochladen</Dialog.Title>
			<Dialog.Description>
				Lade Dateien hoch und schneide Bilder gegebenfalls zu.
			</Dialog.Description>
		</Dialog.Header>
		{#if files.length > 0}
			<div class="grid h-fit gap-3">
				{#each files as file, index}
					<div class="bg-accent flex rounded-lg p-3">
						<div class="flex flex-1 flex-col">
							<div class="text-accent-foreground flex flex-col space-y-2 text-xs font-medium">
								{file.name}
							</div>
							<div class="text-muted-foreground text-xs">
								{(file?.size / 1_000_000).toPrecision(2)} MB
							</div>
						</div>
						<div class="flex space-x-3">
							{#if file.type.startsWith('image/')}
								<Button size="sm" variant="outline" onclick={() => (cropping = !cropping)}
									>{cropping ? 'Abbrechen' : 'Zuschneiden'}</Button
								>
							{/if}
							<Button
								variant="outline"
								size="sm"
								onclick={() => {
									files = [];
								}}>Löschen</Button
							>
						</div>
					</div>
					{#if file.type.startsWith('image/')}
						{#if cropping}
							<div class="">
								<FileUploadCropper bind:getCroppedImage imageUrl={URL.createObjectURL(file)} />
							</div>
						{:else}
							<div class="flex max-h-[300px] w-full items-center justify-center">
								<img
									class="h-full w-auto object-cover"
									src={URL.createObjectURL(file)}
									alt={file.name}
								/>
							</div>
						{/if}
					{/if}
				{/each}
			</div>
		{:else}
			<div class="grid gap-4 py-4">
				<label
					for="file"
					class="text-muted-foreground bg-accent flex w-full items-center justify-center rounded-lg py-12 text-xs"
				>
					Klicke auf die Fläche, um Dateien auszuwählen.
				</label>
				<input id="file" name="file" type="file" class="hidden" onchange={handleInputChange} />
			</div>
		{/if}
		<Dialog.Footer>
			{#if !cropping}
				<Button
					onclick={() => {
						fileStore.set(files);
						confirmUpload.set(true);
						resetFileUpload();
						files = [];
					}}>Fertig</Button
				>
			{:else}
				<Button
					onclick={() => {
						cropping = false;
						if (getCroppedImage) {
							getCroppedImage().then((blob) => {
								files = [new File([blob], 'cropped_' + files[0].name, { type: files[0].type })];
							});
						}
					}}>Zuschneiden</Button
				>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
