<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import getFiles from '$lib/fileUpload';
	import { toast } from 'svelte-sonner';
	import { updatePost } from '$lib/api/posts';

	let { data }: { data: PageData } = $props();

	let currentTitle = $state.raw(data.currentPost.title);
	let currentDescription = $state.raw(data.currentPost.description);
	let currentHeroImage: File | null = $state.raw(data.currentPost.heroImageFileObject);

	let canSave = $derived.by(() => {
		return (
			(currentTitle != data.currentPost.title ||
				currentDescription != data.currentPost.description ||
				currentHeroImage?.name != data.currentPost.heroImage) &&
			currentTitle != '' &&
			currentDescription != '' &&
			currentHeroImage
		);
	});

	console.log(data);
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Metadaten</h3>
		<p class="text-muted-foreground text-sm">
			Lege für deinen Bericht Titel, Beschreibung und ein Bild fest.
		</p>
	</div>
	<Separator class="w-full" />
	<div class="flex flex-col w-full gap-10">
		<div class="flex w-full max-w-sm flex-col gap-2">
			<Label for="title">Titel</Label>
			<Input
				bind:value={currentTitle}
				name="title"
				type="text"
				id="title"
				placeholder="Neuer Bericht"
			/>
			<p class="text-muted-foreground text-sm">
				Der Titel wird als Kopfzeile des Berichts angezeigt.
			</p>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-2">
			<Label for="description">Beschreibung</Label>
			<Textarea
				name="description"
				bind:value={currentDescription}
				id="description"
				placeholder="Kurze Beschreibung zum Bericht"
			/>
			<!-- <p class="text-muted-foreground text-sm">
				Der Titel wird als Kopfzeile des Berichts angezeigt.
			</p> -->
		</div>
		<div class="flex w-full max-w-sm flex-col gap-2">
			<Label for="image">Bild</Label>
			{#if !currentHeroImage}
				<Input name="image" type="file" id="image" accept="image/*" />
			{:else}
				<div class="p-3 border bg-white rounded-md flex justify-between items-center">
					<p class="text-sm">
						{currentHeroImage.name}
					</p>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => {
							if (currentHeroImage?.name != data.currentPost.heroImage) {
								return (currentHeroImage = data.currentPost.heroImageFileObject);
							}

							getFiles().then((files) => {
								if (currentHeroImage.name == files[0].name) {
									return toast.info('Das Bild ist bereits ausgewählt.');
								}
								currentHeroImage = files[0];
							});
						}}
						>{currentHeroImage?.name != data.currentPost.heroImage
							? 'Zurücksetzen'
							: 'Bild ändern'}</Button
					>
				</div>
			{/if}
			<p class="text-muted-foreground text-sm">
				Dieses Bild wird dann als Titelbild des Berichts angezeigt.
			</p>
		</div>

		<Button
			class="ml-auto w-fit"
			disabled={!canSave}
			onclick={() => {
				let updateData = {
					...(currentTitle != data.currentPost.title && {
						title: currentTitle
					}),
					...(currentDescription != data.currentPost.description && {
						description: currentDescription
					}),
					...(currentHeroImage?.name != data.currentPost.heroImage && {
						heroImage: currentHeroImage
					})
				};

				updatePost(
					data.currentPost.id,
					updateData,
					async () => {
						toast.success('Metadaten erfolgreich gespeichert.');
					},
					(error) => {
						console.error(error);
						return toast.error('Fehler beim Speichern der Metadaten.');
					}
				);
			}}>Speichern</Button
		>
	</div>
</div>
