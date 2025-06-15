<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	console.log(data);
</script>

<div class="w-full grid grid-cols-3 gap-6">
	{#if data.posts.length > 0}
		{#each data.posts as post (post.id)}
			<PostCard {post} />
		{/each}
	{:else}
		<p class="col-span-3 text-center text-gray-500">Keine Berichte gefunden. </p>
		
	{/if}
</div>
