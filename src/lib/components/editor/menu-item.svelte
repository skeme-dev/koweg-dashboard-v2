<script lang="ts">
	let { icon, title, action, isActive, disable } = $props();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	class={`cursor-pointer flex justify-center items-center w-9 py-1 px-3 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-black text-white hover:bg-black' : ''}`}
	{title}
	onclick={action}
	disabled={disable}
>
	<i class={`ri-${icon} text-xl`}></i>
</button>
