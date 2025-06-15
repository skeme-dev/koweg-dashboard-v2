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
	// import * as Popover from "$lib/components/ui/popover/index.js";
	import CreateSponsorDialog from '$lib/components/create-sponsor-dialog.svelte';
	import EditSponsorDialog from '$lib/components/edit-sponsor-dialog.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { requestDelete } from '@/components/delete-dialog/index.js';
	import { deleteSponsor } from '@/api/sponsors.js';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';


	let { data } = $props();

	let createSponsorDialogOpen: boolean = $state.raw(false);
	let editSponsorDialogOpen: boolean = $state.raw(false);

	let selectedSponsor = $state.raw({})

	let imageElement;

	let cropper;

	function selectSponsor(sponsor) {
		selectedSponsor = sponsor;

		console.log("select sponsor")

		if (selectSponsor) {
			editSponsorDialogOpen = true;
			
		} else {
			editSponsorDialogOpen = false;
		}
	}

	onMount(async () => {
  		const CropperModule = await import('cropperjs');
  		const Cropper = CropperModule.default;
  		
		cropper = new Cropper(imageElement, {
			aspectRatio: 16 / 9, // Seitenverhältnis 1:1 (kann geändert werden)
			viewMode: 2,
			autoCropArea: 1,
			responsive: false
		});
	});
</script>

<CreateSponsorDialog bind:open={createSponsorDialogOpen} />
<EditSponsorDialog bind:sponsor={selectedSponsor} bind:open={editSponsorDialogOpen} />

<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
	<Tabs.Root value="all">
		<div class="flex items-center">
			<Tabs.List>
				<Tabs.Trigger value="all">All</Tabs.Trigger>
				
			</Tabs.List>
			<div class="ml-auto flex items-center gap-2">
				<Button size="sm" class="h-8 gap-1" onclick={() => (createSponsorDialogOpen = true)}>
					<PlusCircle class="h-3.5 w-3.5" />
					<span class="sr-only sm:not-sr-only sm:whitespace-nowrap"> Sponsor hinzufügen </span>
				</Button>
			</div>
		</div>
		
		<Tabs.Content value="all">
			<Card.Root>
				<Card.Header>
					<Card.Title>Sponsoren</Card.Title>
					<Card.Description>Verwalte alle Sponsoren des Vereins.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Name</Table.Head>
								<Table.Head>Sponsorart</Table.Head>
								<Table.Head class="hidden md:table-cell">Sponsorenbild</Table.Head>
								<Table.Head class="hidden md:table-cell">Link</Table.Head>
								<Table.Head>
									<span class="sr-only">Aktionen</span>
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#if data.sponsors.length === 0}
								<Table.Row>
									<Table.Cell
										colspan="5"
										class="text-muted-foreground py-6 text-center font-medium"
									>
										Keine Sponsoren gefunden.
									</Table.Cell>
								</Table.Row>
							{:else}
								{#each data.sponsors as sponsor}
									<Table.Row>
										<Table.Cell class="font-medium">{sponsor.name}</Table.Cell>
										<Table.Cell>
											<Badge variant="outline">
												{#if sponsor.main_sponsor}
													Hauptsponsor
												{:else}
													Sponsor
												{/if}
											</Badge>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">
											<img
												src={PUBLIC_POCKETBASE_URL +
													'/api/files/sponsors/' +
													sponsor.id +
													'/' +
													sponsor.logo}
												alt={sponsor.logo}
												class="max-h-40 max-w-full object-cover"
											/>
										</Table.Cell>
										<Table.Cell class="hidden md:table-cell">
											<a href={sponsor.link}>
												{sponsor.link}
											</a>
										</Table.Cell>
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
													<DropdownMenu.Item
														onclick={() => {
															selectSponsor(sponsor);
														}}>Bearbeiten</DropdownMenu.Item
													>
													<DropdownMenu.Item
														onclick={() => {
															requestDelete('Sponsor löschen', () => {
																deleteSponsor(
																	sponsor.id,
																	async () => {
																		console.log('Sponsor deleted successfully');
																		toast.success('Sponsor wurde erfolgreich gelöscht');
																		await invalidateAll();
																		data.sponsors = data.sponsors.filter(
																			(s) => s.id !== sponsor.id
																		);
																	},
																	(error) => {
																		toast.error('Fehler beim Löschen des Sponsors');
																		console.error('Error while deleting sponsor:', error);
																	}
																);
															});
														}}>Löschen</DropdownMenu.Item
													>
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</Table.Cell>
									</Table.Row>
								{/each}
							{/if}
						</Table.Body>
					</Table.Root>
				</Card.Content>
				<Card.Footer>
					<div class="text-muted-foreground text-xs">
						Angezeigt <strong>{data.sponsors.length}</strong> von
						<strong>{data.sponsors.length}</strong> Sponsoren
					</div>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</main>
