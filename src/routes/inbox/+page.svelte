<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Search } from 'lucide-svelte';
	import type { PageData } from './$types';
	import Input from '$lib/components/ui/input/input.svelte';
	import RequestList from '$lib/components/requests/request-list.svelte';
	import RequestDisplay from '$lib/components/requests/request-display.svelte';
	import { requestStore } from '$lib/components/requests/store';
	import { ResizablePane, ResizablePaneGroup } from '$lib/components/ui/resizable';
	import ResizableHandle from '$lib/components/ui/resizable/resizable-handle.svelte';

	const defaultLayout = [265, 100, 655];

	let { data }: { data: PageData } = $props();
</script>

<ResizablePaneGroup direction="horizontal" class="h-full max-h-[800px] items-stretch">
	<ResizablePane minSize={30} defaultSize={defaultLayout[1]}>
		<Tabs.Root value="all">
			<div class="flex items-center px-4 py-2">
				<h1 class="text-xl font-bold">Anfragen</h1>
				<Tabs.List class="ml-auto">
					<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200"
						>Alle Anfragen</Tabs.Trigger
					>
					<Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200"
						>Ungelesen</Tabs.Trigger
					>
				</Tabs.List>
			</div>
			<Separator />
			<div class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur">
				<form>
					<div class="relative">
						<Search
							class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
						/>
						<Input placeholder="Suchen" class="pl-8" />
					</div>
				</form>
			</div>
			<Tabs.Content value="all" class="m-0">
				<RequestList items={data.requests} />
			</Tabs.Content>
			<Tabs.Content value="unread" class="m-0">
				<RequestList items={data.requests.filter((item) => !item.reviewed)} />
			</Tabs.Content>
		</Tabs.Root>
	</ResizablePane>
	<ResizableHandle withHandle />
	<ResizablePane defaultSize={defaultLayout[2]}>
		<RequestDisplay
			request={data.requests.find((item) => item.id === $requestStore.selected) || null}
		/>
	</ResizablePane>
</ResizablePaneGroup>
