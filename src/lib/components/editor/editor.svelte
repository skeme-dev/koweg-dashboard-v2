<script lang="ts">
	import 'remixicon/fonts/remixicon.css';

	import { onMount, onDestroy } from 'svelte';
	import { Editor, getAttributes, isActive } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import MenuItem from './menu-item.svelte';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import BubbleLinkMenu from './bubble-link-menu.svelte';

	let element;
	let editor;

	export const getContentAsJSON = () => {
		return editor.getJSON();
	};

	export let content;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					orderedList: {
						HTMLAttributes: {
							class: 'list-decimal pl-6'
						}
					},
					bulletList: {
						HTMLAttributes: {
							class: 'list-disc pl-6'
						}
					},
					heading: {
						levels: [2],
						HTMLAttributes: {
							class: 'text-xl font-semibold'
						}
					}
				}),
				Placeholder.configure({
					placeholder: ({ node }) => {
						if (node.type.name === 'heading') {
							return 'What’s the title?';
						}

						return 'Schreibe deinen Bericht...';
					}
				}),
				Underline,
				Link.configure({
					HTMLAttributes: {
						class: 'bg-red-100'
					}
				}),
				Image,
				BubbleMenu
			],
			content: '',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
		// document.getElementsByClassName('.tiptap.ProseMirror')[0].classList.add('outline-none');
		document.querySelector('.tiptap.ProseMirror')?.classList.add('outline-none');
		document.querySelector('.tiptap.ProseMirror')?.classList.add('p-6');
		document.querySelector('.tiptap.ProseMirror')?.classList.add('h-full');

		if (!editor) {
			alert('reload!');
		}

		if (!content || !content.placeholder) {
			editor.commands.setContent(content);
		}
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	const editorActions = [
		{
			icon: 'arrow-go-back-line',
			title: 'Rückgängig machen',
			action: () => editor.commands.undo(),
			disable: () => !editor.can().undo()
		},
		{
			icon: 'arrow-go-forward-line',
			title: 'Wiederholen',
			action: () => editor.commands.redo(),
			disable: () => !editor.can().redo()
		},
		{
			type: 'divider'
		},
		{
			icon: 'bold',
			title: 'Fett',
			action: () => editor.chain().focus().toggleBold().run(),
			isActiveString: 'bold'
		},
		{
			icon: 'italic',
			title: 'Kursiv',
			action: () => editor.chain().focus().toggleItalic().run(),
			isActiveString: 'italic'
		},
		{
			icon: 'underline',
			title: 'Unterstreichen',
			action: () => editor.chain().focus().toggleUnderline().run(),
			isActiveString: 'underline'
		},
		{
			icon: 'strikethrough',
			title: 'Durchstreichen',
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => 'strike'
		},
		{
			type: 'divider'
		},
		{
			icon: 'list-unordered',
			title: 'Ungeordnete Liste',
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActiveString: 'bulletList'
		},
		{
			icon: 'list-ordered-2',
			title: 'Geordnete Liste',
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActiveString: 'orderedList'
		},
		{
			icon: 'separator',
			title: 'Horizontale Linie',
			action: () => editor.chain().focus().setHorizontalRule().run(),
			isActive: null
		},
		{
			type: 'divider'
		},
		{
			icon: 'link-m',
			title: 'Link',
			action: () =>
				editor.chain().focus().toggleLink({ href: currentLink, target: '_blank' }).run(),
			isActiveString: 'link'
		},
		{
			icon: 'image-add-line',
			title: 'Bild',
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => editor.isActive('strike')
		}
	];

	let currentLink;
	let canSave: boolean = false;
</script>

<div class="flex flex-col w-full">
	{#if editor}
		<div class="flex flex-col w-full">
			<div class="w-full flex space-x-6 rounded-lg bg-white p-3 border">
				{#each editorActions as editorAction}
					{#if editorAction.type !== 'divider'}
						<MenuItem
							action={editorAction.action}
							icon={editorAction.icon}
							title={editorAction.title}
							isActive={editorAction.isActiveString && editor.isActive(editorAction.isActiveString)}
							disable={editorAction.disable}
						/>
					{:else}
						<div class="w-2" />
					{/if}
				{/each}
			</div>
			<BubbleLinkMenu
				{editor}
				tippyOptions={{
					// triggerTarget: document.getElementsByTagName('a'),
					onTrigger: () => alert('test')
				}}
				shouldShow={({ editor, view, state, oldState, from, to }) => {
					// only show the bubble menu for images and links
					currentLink = editor.getAttributes('link').href;
					return editor.isActive('image') || editor.isActive('link');
				}}
			>
				<div class="bg-white shadow-xl divide-x-2 border-2 flex rounded-lg">
					<input
						bind:value={currentLink}
						on:focus={() => {
							canSave = true;
						}}
						class="text-sm py-1 px-2 mr-1 outline-none rounded-l-lg"
						type="url"
					/>
					<div class="flex space-x-1 p-1">
						<button
							on:click={() => {
								editor.commands.setLink({ href: currentLink, target: '_blank' });
							}}
							disabled={!canSave}
							class={`w-9 h-8 rounded-lg ${canSave ? 'hover:bg-gray-100' : 'text-gray-300'}`}
							title="Link speichern"
						>
							<i class="text-lg ri-check-line" />
						</button>
						<button
							on:click={() => window.open(currentLink)}
							class="w-9 h-8 rounded-lg hover:bg-gray-100"
							title="Link öffnen"
						>
							<i class="text-lg ri-eye-line" />
						</button>
						<button
							on:click={() => editor.commands.unsetLink()}
							class="w-9 h-8 rounded-lg hover:bg-red-100 text-red-600"
							title="Link entfernen"
						>
							<i class="text-lg ri-delete-bin-line" />
						</button>
					</div>
				</div>
			</BubbleLinkMenu>
		</div>
	{/if}
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	id="editor"
	on:click={() => editor.chain().focus()}
	class="bg-white w-full h-[200%] mt-6 cursor-text border rounded-lg"
	bind:this={element}
/>
