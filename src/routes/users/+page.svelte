<script lang="ts">
	import File from 'lucide-svelte/icons/file';
	import ListFilter from 'lucide-svelte/icons/list-filter';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import CirclePlus from 'lucide-svelte/icons/circle-plus';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import CreateUserDialog from '$lib/components/create-user-dialog.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { sendFormData } from '@/api/helpers.js';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let createUserDialogOpen: boolean = $state.raw(false);

	function inviteUser(userId: string) {
		sendFormData('/users?/invite', {
			userId: userId
		})
			.then((response) => {
				console.log('response', response);

				if (response.status === 200) {
					toast.success('Einladung erfolgreich versendet');
				} else {
					toast.error("Einladung konnte nicht versendet werden");
				}
			})
			.catch((error) => {
				console.error('error sending invitation', error);
				toast.error('Fehler beim Versenden der Einladung');
			});
	}
</script>

<CreateUserDialog bind:open={createUserDialogOpen} />

<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
	<Tabs.Root value="all">
		<div class="flex items-center">
			<Tabs.List>
				<Tabs.Trigger value="all">All</Tabs.Trigger>
				<Tabs.Trigger value="active">Active</Tabs.Trigger>
				<Tabs.Trigger value="draft">Draft</Tabs.Trigger>
				<Tabs.Trigger value="archived" class="hidden sm:flex">Archived</Tabs.Trigger>
			</Tabs.List>
			<div class="ml-auto flex items-center gap-2">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" size="sm" class="h-8 gap-1">
							<ListFilter class="h-3.5 w-3.5" />
							<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Filter </span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						<DropdownMenu.Label>Filter by</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.CheckboxItem checked>Active</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem>Draft</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem>Archived</DropdownMenu.CheckboxItem>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<Button size="sm" variant="outline" class="h-8 gap-1">
					<File class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Exportieren </span>
				</Button>
				<Button size="sm" class="h-8 gap-1" onclick={() => (createUserDialogOpen = true)}>
					<PlusCircle class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Benutzer erstellen </span>
				</Button>
			</div>
		</div>
		<Tabs.Content value="all">
			<Card.Root>
				<Card.Header>
					<Card.Title>Benutzer</Card.Title>
					<Card.Description>Verwalte alle registrierten Benutzer des Vereins.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head>Rolle</Table.Head>
								<Table.Head class="hidden md:table-cell">E-Mail</Table.Head>
								<Table.Head class="hidden md:table-cell">Status</Table.Head>
								<Table.Head class="hidden md:table-cell">Hinzugefügt am</Table.Head>
								<Table.Head>
									<span class="sr-only">Actions</span>
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.users as user}
								<Table.Row>
									<Table.Cell class="font-medium">{user.name}</Table.Cell>
									<Table.Cell>
										<Badge variant="outline">
											{#if user.role == 'TRAINER'}
												Trainer
											{:else if user.role == 'ADMINISTRATOR'}
												Administrator
											{:else}
												Benutzer
											{/if}
										</Badge>
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">{user.email}</Table.Cell>
									<Table.Cell>
										<Badge variant="outline">
											{#if user.invited}
												Eingeladen
											{:else}
												Ausstehend
											{/if}
										</Badge>
									</Table.Cell>
									<Table.Cell class="hidden md:table-cell">{user.created}</Table.Cell>
									<Table.Cell>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<Ellipsis class="h-4 w-4" />
													<span class="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end">
												<DropdownMenu.Label>Aktionen</DropdownMenu.Label>
												<DropdownMenu.Item>Bearbeiten</DropdownMenu.Item>

												{#if !user.invited}
													<DropdownMenu.Item
														onclick={() => {
															if (!user.invited) {
																inviteUser(user.id);
															} else {
																toast.error('Benutzer wurde bereits eingeladen.');
															}
														}}>Einladung senden</DropdownMenu.Item
													>
												{/if}
												<DropdownMenu.Item>Löschen</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
				<Card.Footer>
					<div class="text-muted-foreground text-xs">
						Angezeigt <strong>{data.users.length}</strong> von <strong>{data.users.length}</strong> Benutzern
					</div>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
