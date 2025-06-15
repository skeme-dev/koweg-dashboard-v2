<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import SidebarNav from '$lib/components/posts/editor/sidebar-nav.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const sidebarNavItems = [
		{
			title: 'Metadaten',
			href: '/posts/create/meta'
		}
	];
</script>

<div class="space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Bericht erstellen</h2>
		<p class="text-muted-foreground">
			Erstelle einen neuen Bericht für dein Team oder deine Abteilung.
		</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="-mx-4 lg:w-1/5">
			<SidebarNav items={sidebarNavItems} />
		</aside>
		<div class="flex-1 lg:max-w-2xl">
			{@render children()}
		</div>
	</div>
</div>
