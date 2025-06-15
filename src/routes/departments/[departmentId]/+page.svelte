<script lang="ts">
	import type { PageData } from './$types';

	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, CirclePlus, KeyRound, Pen, Trash2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { updateDepartment } from '$lib/api/departments';
	import { createTeam } from '$lib/api/teams';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import CreateTeamDialog from '$lib/components/CreateTeamDialog.svelte';
	import { onMount } from 'svelte';
	import PermissionsDialog from '$lib/components/PermissionsDialog.svelte';

	let { data }: { data: PageData } = $props();

	let currentDepartmentName = $state.raw(data.department.label);
	let currentDepartmentDescription = $state.raw(data.department.description);
	let currentDepartmentLeader = $state.raw(data.department.expand.leader);

	let canSave = $derived.by(() => {
		return (
			(currentDepartmentName != data.department.label ||
				currentDepartmentDescription != data.department.description ||
				currentDepartmentLeader != data.department.expand.leader) &&
			currentDepartmentName &&
			currentDepartmentLeader &&
			currentDepartmentDescription
		);
	});

	let userSelectionOpen = $state(false);
	let selectedUser = $state.raw(null);

	let createTeamDialogOpen = $state.raw(false);
	let permissionDialogOpen = $state.raw(false);
</script>

<PermissionsDialog bind:open={permissionDialogOpen} permissions={data.permissions} users={data.users} />
<CreateTeamDialog departmentId={data.department.id} bind:open={createTeamDialogOpen} />
<div class="flex flex-col">
	<div class="flex gap-6">
		<Card.Root class="w-full">
			<Card.Header class="relative">
				<Card.Title>Abteilungsinformationen</Card.Title>
				<Card.Description>Bearbeite die Abteilungsinformationen.</Card.Description>
				<Button
					onclick={() => {
						if (
							!(
								currentDepartmentName != data.department.label ||
								currentDepartmentDescription != data.department.description ||
								currentDepartmentLeader != data.department.expand.leader
							)
						)
							return;

						let updateData = {
							...(currentDepartmentName != data.department.label && {
								label: currentDepartmentName
							}),
							...(currentDepartmentDescription != data.department.description && {
								description: currentDepartmentDescription
							}),
							...(currentDepartmentLeader != data.department.expand.leader && {
								leader: currentDepartmentLeader.id
							})
						};

						updateDepartment(
							data.department.id,
							updateData,
							async () => {
								toast.success('Abteilung wurde erfolgreich aktualisiert.');
								await invalidateAll();
							},
							(error) => {
								console.error(error);
								toast.error('Fehler beim Aktualisieren der Abteilung');
							}
						);
					}}
					disabled={!canSave}
					variant="outline"
					class="absolute top-4 right-6">Speichern</Button
				>
			</Card.Header>
			<Card.Content>
				<div class="flex">
					<div class="flex-1 grid gap-6">
						<div class="grid gap-3">
							<Label for="name">Name</Label>
							<Input id="name" type="text" class="w-full" bind:value={currentDepartmentName} />
						</div>
						<div class="grid gap-3">
							<Label for="description">Beschreibung</Label>
							<Textarea
								id="description"
								bind:value={currentDepartmentDescription}
								class="min-h-32"
							/>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
		<div class="min-w-[25%] space-y-6">
		<Card.Root class="h-fit">
			<Card.Header>
				<Card.Title>Abteilungsleiter</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6">
					<div class="grid gap-3">
						{#if currentDepartmentLeader}
							<div class="flex items-center justify-between">
								<span class="text-sm">{currentDepartmentLeader.name}</span>
								<Button
									onclick={() => {
										currentDepartmentLeader = null;
									}}
									variant="ghost"
									size="icon"
								>
									<Trash2 class="h-3.5 w-3.5" />
								</Button>
							</div>
						{/if}
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="justify-center border-t">
				<Button
					disabled={!!currentDepartmentLeader}
					onclick={() => (userSelectionOpen = true)}
					size="sm"
					variant="ghost"
					class="gap-1"
				>
					<CirclePlus class="h-3.5 w-3.5" />
					Abteilungsleiter hinzufügen
				</Button>
			</Card.Footer>
		</Card.Root>
		<Button onclick={() => (permissionDialogOpen = true)} variant="outline" class="w-full">
			<KeyRound class="mr-2 w-4 h-4" />
			<span> Zugriff verwalten </span>
		</Button>
	</div>
	</div>

	<div class="space-y-3 mt-3">
		<Label class="my-2">Teams</Label>
		<div class="grid gap-6 grid-cols-4">
			{#each data.department.expand.teams as team}
				<Card.Root class="w-full">
					<Card.Header>
						<Card.Title>{team.name}</Card.Title>
						<Card.Description>{team.description}</Card.Description>
					</Card.Header>
					<Card.Footer class="justify-center border-t">
						<Button size="sm" class="mx-auto" variant="ghost" href={'/teams/' + team.id}>
							<Pen class="h-3.5 w-3.5" />
							Bearbeiten
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
			<Button
				onclick={() => {
					createTeamDialogOpen = true;
				}}
				variant="outline"
				class="h-full gap-2 text-sm"
			>
				<CirclePlus class="h-3.5 w-3.5" />
				Team erstellen
			</Button>
		</div>
	</div>
</div>

<Dialog.Root bind:open={userSelectionOpen}>
	<Dialog.Content class="gap-0 p-0 outline-none">
		<Dialog.Header class="px-4 pb-4 pt-5">
			<Dialog.Title>Abteilungsleiter hinzufügen</Dialog.Title>
			<Dialog.Description>
				Wähle einen Benutzer aus, um ihn als Abteilungsleiter hinzuzufügen.
			</Dialog.Description>
		</Dialog.Header>
		<Command.Root class="overflow-hidden rounded-t-none border-t bg-transparent">
			<Command.Input placeholder="Benutzer suchen..." />
			<Command.List>
				<Command.Empty>Keine Benutzer gefunden</Command.Empty>
				<Command.Group class="p-2">
					{#each data.users.filter((user) => {
						return user.role === 'DEPARTMENT_LEADER';
					}) as user}
						<Command.Item
							class="flex items-center px-2"
							onSelect={() => {
								selectedUser = user;
							}}
						>
							<Avatar.Root>
								<Avatar.Image src={user.avatar} alt="Image" />
								<Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
							</Avatar.Root>
							<div class="ml-2">
								<p class="text-sm font-medium leading-none">
									{user.name}
								</p>
								<p class="text-muted-foregro und text-sm">
									{user.email}
								</p>
							</div>
							{#if selectedUser == user}
								<Check class="text-primary ml-auto flex h-5 w-5" />
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
		<Dialog.Footer class="flex items-center border-t p-4 sm:justify-between">
			{#if selectedUser}
				<div class="flex -space-x-2 overflow-hidden">
					<div class="flex items-center space-x-2">
						<Avatar.Root class="border-background inline-block border-2">
							<Avatar.Image src={selectedUser.avatar} />
							<Avatar.Fallback>{selectedUser.name[0]}</Avatar.Fallback>
						</Avatar.Root>
						<p class="text-sm font-medium leading-none">{selectedUser.name}</p>
					</div>
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Wähle einen Benutzer aus, um ihn hinzuzufügen.</p>
			{/if}
			<Button
				disabled={!selectedUser}
				onclick={() => {
					currentDepartmentLeader = selectedUser;
					selectedUser = null;
					userSelectionOpen = false;
				}}>Weiter</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
