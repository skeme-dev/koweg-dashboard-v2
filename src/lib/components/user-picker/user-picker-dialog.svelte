<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { picked, resetStore, userPickerStore } from './store';
	import type { Unsubscriber } from 'svelte/store';

	import * as Dialog from '../../components/ui/dialog';
	import Button from '../ui/button/button.svelte';
	import Badge from '../ui/badge/badge.svelte';
	import { Check, CircleCheck } from 'lucide-svelte';

	// let unsubscribe: Unsubscriber;

	let { users } = $props();

	let open: boolean = $state.raw(false);
	let selectedUsers = $state.raw(users);

	function selected(uid: string): boolean {
		return selectedUsers.findIndex((user) => user.id === uid) !== -1;
	}

	function select(user) {
		if (selected(user.id)) {
			selectedUsers = selectedUsers.filter((u) => u.id !== user.id);
		} else {
			selectedUsers = [...selectedUsers, user];
		}
	}

	// onMount(() => {
	const unsubscribe = userPickerStore.subscribe((value) => {
		if (value.open) {
			open = true;
			selectedUsers = value.selectedUsers;
		} else {
			open = false;
		}
	});
	// });

	onDestroy(() => {
		unsubscribe();
		resetStore();
	});
</script>

<Dialog.Root
	bind:open
	onOpenChange={(opened) => {
		if (!opened) {
			resetStore();
		}
	}}
>
	<Dialog.Content class="max-w-[50%]">
		<Dialog.Header>
			<Dialog.Title>Benutzer auswählen</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="">
			<div class="">
				{#if users}
					<div class="grid border rounded-lg">
						{#each users as user, index}
							<button
								onclick={() => select(user)}
								class="p-3 w-full space-x-2 hover:bg-muted-background transition-all duration-200 flex items-center"
								class:border-t={index != 0}
							>
								{#if selected(user.id)}
									<div class="flex justify-center items-center w-5 h-5 border rounded-full">
										<Check class="w-3 h-3" />
									</div>
								{:else}
									<div class="w-5 h-5 rounded-full border"></div>
								{/if}
								<div class="text-sm">{user.name}</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			<div class="mt-4">
				<p class="text-sm font-medium">Ausgewählte Benutzer</p>
				<div class=" mt-2 min-h-[50px]">
					{#if selectedUsers.length > 0}
						<div class="space-x-1">
							{#each selectedUsers as user, index}
								<Badge variant="outline">{user.name}</Badge>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				disabled={selectedUsers.length === 0}
				onclick={() => {
					userPickerStore.set({
						selectedUsers: selectedUsers,
						open: false
					});

					picked.set(true);
					resetStore();
				}}>Fertig</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
