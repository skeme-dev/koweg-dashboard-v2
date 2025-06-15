<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { createTeam } from '$lib/api/teams';
	import { getUser } from './user-picker';
	import { X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { open = $bindable(), departmentId } = $props();

	let currentName = $state.raw('');
	let currentDescription = $state.raw('');
	let selectedTrainers = $state.raw([]);

	let step: number = $state.raw(1);
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="min-w-[33%]">
		<Sheet.Header>
			<Sheet.Title>Team erstellen</Sheet.Title>
			<Sheet.Description>
				Erstelle ein neues Team. Klicke auf Erstellen, wenn du fertig bist.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 p-4">
			<div class="grid items-center gap-4">
				<Label for="name" class="text-left">Name</Label>
				<Input id="name" bind:value={currentName} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="description" class="text-left">Beschreibung</Label>
				<Input id="description" bind:value={currentDescription} class="col-span-3" />
			</div>
			<div class="">
				<div class="grid items-center gap-4">
					<Label>Trainer</Label>
					<div class="flex flex-col border rounded-lg">
						{#each selectedTrainers as trainer, index}
							<div
								class="text-sm p-2 px-3 w-full space-x-2 hover:bg-muted-background transition-all duration-200 flex justify-between items-center"
								class:border-t={index != 0}
							>
								<p>{trainer.name}</p>
								<button
									class="p-2 ml-auto"
									onclick={() =>
										(selectedTrainers = selectedTrainers.filter((t) => t.id !== trainer.id))}
								>
									<X class=" w-4 h-4" />
								</button>
							</div>
						{/each}
						<button
							onclick={() => {
								open = false;
								getUser().then((users) => {
									selectedTrainers = users;
									open = true;
								});
							}}
							class="w-full py-2 text-sm font-medium hover:bg-accent transition-all duration-200"
							class:border-t={selectedTrainers.length > 0}>Benutzer auswählen</button
						>
					</div>
				</div>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close>
				<Button
					disabled={currentName.length === 0 ||
						currentDescription.length === 0 ||
						selectedTrainers.length === 0}
					onclick={() => {
						console.log("CREATING")
						createTeam(
							departmentId,
							{
								name: currentName,
								description: currentDescription,
								trainers: selectedTrainers.map((t) => t.id)
							},
							async () => {
								open = false;
								toast.success('Team wurde erfolgreich erstellt.');
								await invalidateAll();
							},
							(error) => {
								console.error(error);
								toast.error('Team konnte nicht erstellt werden.');
							}
						);
					}}
					class="mt-4 w-full"
					type="submit">Erstellen</Button
				>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
