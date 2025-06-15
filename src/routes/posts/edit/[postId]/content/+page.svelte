<script lang="ts">
	import { updatePost } from '$lib/api/posts';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import Editor from '$lib/components/editor/editor.svelte';

	let { data }: { data: PageData } = $props();

	let currentContent = $state.raw(data.currentPost.content);

	let editor;
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium">Inhalt</h3>
		<p class="text-muted-foreground text-sm">Füge den Inhalt deines Berichts ein.</p>
	</div>
	<Separator class="w-full mb-3" />
	<div class="flex flex-1 flex-col space-y-6">
		<!-- <Textarea
			id="input"
			placeholder="Berichtinhalt hier einfügen..."
			class="flex-1 lg:min-h-[580px]"
		/> -->
		<Editor bind:this={editor} content={currentContent} />
		<Button
			class="w-fit ml-auto"
			onclick={() => {
				currentContent = editor.getContentAsJSON();

				console.log(currentContent);

				updatePost(
					data.currentPost.id,
					{ content: JSON.stringify(currentContent) },
					async () => {
						toast.success('Inhalt erfolgreich gespeichert.');
					},
					(error) => {
						console.error(error);
						return toast.error('Fehler beim Speichern des Inhalts.');
					}
				);
			}}>Speichern</Button
		>
	</div>
</div>
