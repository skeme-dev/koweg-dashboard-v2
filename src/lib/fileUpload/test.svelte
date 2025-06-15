<script lang="ts">
  import { fileUploadDialog } from './store2';
  import { onMount } from 'svelte';

  let fileInput: HTMLInputElement;

  function triggerInput() {
    fileInput?.click();
  }

  function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    fileUploadDialog.resolve(file);
    fileInput.value = ''; // reset für nächsten Upload
  }

  onMount(() => {
    fileUploadDialog.setTrigger(triggerInput);
  });
</script>

<input
  type="file"
  bind:this={fileInput}
  on:change={onFileChange}
  style="display: none"
/>