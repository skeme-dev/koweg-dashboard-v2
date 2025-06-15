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
	import { createPostByMetaData, updatePost } from '$lib/api/posts';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let currentTitle = $state.raw('');
	let currentDescription = $state.raw('');
	let currentHeroImage: File | null = $state.raw(null);

	let canSave = $derived.by(() => {
		return currentTitle != '' && currentDescription != '' && currentHeroImage;
	});

	console.log(data);

	console.log(
		data.posts.find((p) => {
			p.title == currentTitle;
		})
	);
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
				<Button
					variant="outline"
					onclick={() => {
						getFiles()
							.then((files) => {
								currentHeroImage = files[0];
							})
							.catch((err) => {
								console.error(err);
								return toast.error('Fehler beim Hochladen des Bildes.');
							});
					}}>Bild hochladen</Button
				>
			{:else}
				<div class="p-3 border bg-white rounded-md flex justify-between items-center">
					<p class="text-sm">
						{currentHeroImage.name}
					</p>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => {
							getFiles().then((files) => {
								if (currentHeroImage.name == files[0].name) {
									return toast.info('Das Bild ist bereits ausgewählt.');
								}
								currentHeroImage = files[0];
							});
						}}>Bild ändern</Button
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
					...(currentTitle != '' && {
						title: currentTitle
					}),
					...(currentDescription != '' && {
						description: currentDescription
					}),
					...(currentHeroImage?.name != null && {
						heroImage: currentHeroImage
					})
				};

				console.log(updateData);

				createPostByMetaData(
					updateData,
					(res) => {
						return window.location.replace('/posts/edit/' + JSON.parse(res.data)[1] + '/content');
					},
					(error) => {
						console.error(error);
						return toast.error('Fehler beim Erstellen des Berichts.');
					}
				);
			}}>Speichern</Button
		>
	</div>
</div>
