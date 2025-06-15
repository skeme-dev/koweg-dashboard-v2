<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { createSponsor, updateSponsor } from '$lib/api/sponsors';
	import * as Select from './ui/select';
	import getFiles from '$lib/fileUpload';
	import Switch from './ui/switch/switch.svelte';

	let { open = $bindable(), sponsor = $bindable() } = $props();

	let currentName = $state.raw(sponsor?.name);
	let currentFile = $state.raw(new File([], sponsor?.logo));
	let currentLink = $state.raw(sponsor?.link);
	let currentIsMainSponsor = $state.raw(sponsor?.main_sponsor || false);

	let fileChanged = $state.raw(false);
	
	$inspect(sponsor)
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="min-w-[33%]">
		<Sheet.Header>
			<Sheet.Title>Sponsor bearbeiten</Sheet.Title>
			<Sheet.Description>
				Bearbeite den ausgewählten Sponsor. Klicke auf Speichern, wenn du fertig bist.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 p-4">
			<div class="grid items-center gap-4">
				<Label for="name" class="text-left">Name</Label>
				<Input id="name" bind:value={currentName} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="email" class="text-left">Sponsorenbild</Label>
				
				<!-- {#if !currentFile} -->
				<Button size="sm" class="w-max" onclick={() => {
					open = false;
					getFiles().then((files) => {
						if (files.length > 0) {
							currentFile = files[0];
							toast.success('Bild erfolgreich hochgeladen.');
							open = true;

							fileChanged = true;
						} else {
							open = true;
							toast.error('Bild konnte nicht hochgeladen werden.');
						}
					}); 
					
				}}>Bild ändern</Button>
				<!-- {:else}
				<div class="flex items-center justify-between bg-muted/50 p-3 rounded-md">
					<p class="text-xs font-medium">{currentFile?.name}</p>
					<Button variant="outline" size="sm">Ändern</Button>
				</div> -->
				<!-- {/if} -->
			</div>
			<div class="grid items-center gap-4">
				<Label for="link" class="text-left">Link</Label>
				<Input id="link" type="url" bind:value={currentLink} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="role" class="text-left">Sponsorenart</Label>

				<div class="flex items-center space-x-3">
					<Switch includeInput bind:checked={currentIsMainSponsor} />
					<p class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:text-left">Ist Hauptsponsor</p>
				</div>

			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close>
				<Button
					disabled={currentName?.length === 0 ||
						currentLink?.length === 0}
					onclick={() => {
						updateSponsor(
							{
								id: sponsor?.id,
								name: currentName,
								...(fileChanged && {logo: currentFile}),
								link: currentLink,
								main_sponsor: currentIsMainSponsor
							},
							async () => {
								open = false;
								toast.success('Sponsor wurde erfolgreich gespeichert.');
								await invalidateAll();
							},
							(error) => {
								console.error(error);
								toast.error('Benutzer konnte nicht erstellt werden.');
							}
						);

						console.log({
							name: currentName,
							file: currentFile,
							link: currentLink,
							isMainSponsor: currentIsMainSponsor
						})
					}}
					class="mt-4 w-full"
					
					type="submit">Speichern</Button
				>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
