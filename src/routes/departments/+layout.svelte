<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import SidebarNav from '$lib/components/posts/editor/sidebar-nav.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { CirclePlus } from 'lucide-svelte';
	import CreateDepartmentDialog from '$lib/components/CreateDepartmentDialog.svelte';
	import { getPermissionsByUserId } from '@/index';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// get permissions from the data
	const permissions = getPermissionsByUserId(data.user.id, data.permissions);


	let sidebarNavItems = data.user.role == "ADMIN" ? data.departments.map((item) => ({
		title: item.label,
		href: '/departments/' + item.id
	})) : data.departments.filter(m => {
		return permissions.map(p => p.deps).includes(m.id) // filter departments based on user permitted department ids
	}).map((item) => ({
		title: item.label,
		href: '/departments/' + item.id
	}));

	let createDepartmentDialogOpen = $state.raw(false);
</script>

<CreateDepartmentDialog bind:open={createDepartmentDialogOpen} />

<div class="space-y-6 p-10 pb-16 md:block">
	<div class="flex items-end justify-between">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Abteilungen verwalten</h2>
			<p class="text-muted-foreground">Verwalte alle Abteilungen, sowie deren Teams.</p>
		</div>
		<Button
			size="lg"
			class="gap-2 text-sm"
			onclick={() => {
				createDepartmentDialogOpen = true;
			}}
		>
			<CirclePlus class="h-3.5 w-3.5" />
			Abteilung hinzufügen
		</Button>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="lg:mr-4 lg:w-1/5">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex-1 lg:max-w-full">
			{@render children()}
		</div>
	</div>
</div>
