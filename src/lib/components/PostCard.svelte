<script lang="ts">
	import { EllipsisVertical, Pen } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import * as Card from './ui/card';
	import Badge from './ui/badge/badge.svelte';

	let { post } = $props();

	console.log(post.heroImage);
</script>

<Card.Root>
	<Card.Header class={!post.heroImage ? 'pb-6' : ''}>
		<Card.Title class="flex justify-between">
			{post.title}
			<Badge variant="secondary">{post.isPublished ? 'Öffentlich' : 'Privat'}</Badge>
		</Card.Title>
		<Card.Description>{post.description}</Card.Description>
	</Card.Header>
	{#if post.heroImage}
		<Card.Content>{post.heroImage}</Card.Content>
	{/if}
	<Card.Footer class="justify-center border-t p-4">
		<Button href={'/posts/edit/' + post.id + '/meta'} variant="ghost" class="gap-2">
			<Pen class="h-3.5 w-3.5" />
			Bearbeiten
		</Button>
		<!-- <Button size="icon" variant="ghost">
			<EllipsisVertical class="h-4 w-4" />
		</Button> -->
	</Card.Footer>
</Card.Root>
