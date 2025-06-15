<script lang="ts">
	let { data, form } = $props();
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	console.log(data.uid);
</script>

<div class="h-screen w-full">
	<div class="flex h-full items-center justify-center py-12">
		<div class="mx-auto grid w-[30%] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Wilkommen</h1>
				<p class="text-muted-foreground text-balance">
					Erstelle ein persönliches Passwort, um dich zu registrieren.
				</p>
			</div>
			{#if form?.error}
				Fehler: {form?.error}
			{/if}
			<form action="?/changePassword" method="post">
				<div class="grid gap-6">
					<div class="grid gap-2">
						<Label for="password">Neues Passwort</Label>
						<Input name="password" id="password" type="password" required />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="passwordConfirm">Password wiederholen</Label>
						</div>
						<Input name="passwordConfirm" id="passwordConfirm" type="password" required />
					</div>
					<input type="hidden" value={data.uid} name="uid" />
					<Button type="submit" class="w-full">Erstellen</Button>
				</div>
			</form>
		</div>
	</div>
</div>
