<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { getUser } from './user-picker';
	import { X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { createDepartment } from '$lib/api/departments';

	let { open = $bindable() } = $props();

	let currentLabel = $state.raw('');
	let currentDescription = $state.raw('');
	let selectedDepartmentLeader = $state.raw([]);
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="min-w-[33%]">
		<Sheet.Header>
			<Sheet.Title>Abteilung erstellen</Sheet.Title>
			<Sheet.Description>
				Erstelle eine neue Abteilung. Klicke auf Erstellen, wenn du fertig bist.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 p-4">
			<div class="grid items-center gap-4">
				<Label for="name" class="text-left">Name</Label>
				<Input id="name" bind:value={currentLabel} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="description" class="text-left">Beschreibung</Label>
				<Input id="description" bind:value={currentDescription} class="col-span-3" />
			</div>
			<div class="">
				<div class="grid items-center gap-4">
					<Label>Abteilungsleiter</Label>
					<div class="flex flex-col border rounded-lg">
						{#each selectedDepartmentLeader as leader, index}
							<div
								class="text-sm p-2 px-3 w-full space-x-2 hover:bg-muted-background transition-all duration-200 flex justify-between items-center"
								class:border-t={index != 0}
							>
								<p>{leader.name}</p>
								<button
									class="p-2 ml-auto"
									onclick={() =>
										(selectedDepartmentLeader = selectedDepartmentLeader.filter(
											(t) => t.id !== leader.id
										))}
								>
									<X class=" w-4 h-4" />
								</button>
							</div>
						{/each}
						<button
							onclick={() => {
								open = false;
								getUser().then((users) => {
									selectedDepartmentLeader = users;
									open = true;
								});
							}}
							class="w-full py-2 text-sm font-medium hover:bg-accent transition-all duration-200"
							class:border-t={selectedDepartmentLeader.length > 0}>Benutzer auswählen</button
						>
					</div>
				</div>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close>
				<Button
					disabled={currentLabel.length === 0 ||
						currentDescription.length === 0 ||
						selectedDepartmentLeader.length === 0}
					onclick={() => {
						createDepartment(
							{
								label: currentLabel,
								description: currentDescription,
								trainers: selectedDepartmentLeader.map((t) => t.id)
							},
							(id) => {
								open = false;
								toast.success('Abteilung wurde erfolgreich erstellt.');
								window.location.replace(
									'/departments/' + id.substring(id.length - 17, id.length - 2)
								);
							},
							(error) => {
								console.error(error);
								toast.error('Abteilung konnte nicht erstellt werden.');
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
