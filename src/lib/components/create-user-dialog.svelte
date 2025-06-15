<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { createUser } from '$lib/api/users';
	import * as Select from './ui/select';

	let { open = $bindable() } = $props();

	let currentName = $state.raw('');
	let currentEmail = $state.raw('');
	let currentPhoneNumber = $state.raw('');
	let currentRole = $state.raw('');

	const roles = [
		{
			value: 'ADMIN',
			label: 'Administrator'
		},
		{
			value: 'TRAINER',
			label: 'Trainer'
		},
		{
			value: 'DEPARTMENT_LEADER',
			label: 'Abteilungsleiter'
		}
	];

    const triggerContent = $derived(roles.find(role => role.value === currentRole)?.label ?? "Wähle eine Rolle aus")
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="min-w-[33%]">
		<Sheet.Header>
			<Sheet.Title>Benutzer erstellen</Sheet.Title>
			<Sheet.Description>
				Erstelle ein neuen Benutzer. Klicke auf Erstellen, wenn du fertig bist.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 p-4">
			<div class="grid items-center gap-4">
				<Label for="name" class="text-left">Name</Label>
				<Input id="name" bind:value={currentName} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="email" class="text-left">E-Mail</Label>
				<Input id="email" type="email" bind:value={currentEmail} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="phoneNumber" class="text-left">Telefonnummer</Label>
				<Input id="phoneNumber" bind:value={currentPhoneNumber} class="col-span-3" />
			</div>
			<div class="grid items-center gap-4">
				<Label for="role" class="text-left">Rolle</Label>
				<Select.Root
					onSelectedChange={(item) => {
						console.log(item.value);
						currentRole = item.value;
					}}
					portal={null}
				>
					<Select.Trigger class="">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Rolle</Select.Label>
							{#each roles as role}
								<Select.Item value={role.value} label={role.label}>{role.label}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
					<Select.Input name="role" />
				</Select.Root>
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close>
				<Button
					disabled={currentName.length === 0 ||
						currentEmail.length === 0 ||
						currentRole.length === 0 ||
						currentPhoneNumber.length === 0}
					onclick={() => {
						createUser(
							{
								name: currentName,
								email: currentEmail,
								role: currentRole,
								phoneNumber: currentPhoneNumber
							},
							async () => {
								open = false;
								toast.success('Benutzer wurde erfolgreich erstellt.');
								await invalidateAll();
							},
							(error) => {
								console.error(error);
								toast.error('Benutzer konnte nicht erstellt werden.');
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