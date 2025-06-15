<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import type { PageData } from '../$types';

	let { data }: { data: PageData } = $props();

	let currentEmail = $state.raw('');

	console.log(data);
</script>

<div class="space-y-6 p-10 pb-16 md:block">
	<div class="flex items-end justify-between">
		<div class="space-y-0.5">
			<h2 class="text-2xl font-bold tracking-tight">Einstellungen</h2>
			<p class="text-muted-foreground"></p>
		</div>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>E-Mail-Adresse</Card.Title>
			<Card.Description>Ändere deine E-Mail-Adresse in eine neue Adresse.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form>
				<Input type="email" bind:value={currentEmail} />
			</form>
		</Card.Content>
		<Card.Footer class="border-t px-6 py-4">
			<Button>Speichern</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root>
		<Card.Header class="pb-6">
			<Card.Title>Passwort ändern</Card.Title>
			<Card.Description
				>Eine E-Mail wird an deine aktuelle E-Mail-Adresse gesendet, um dein Passwort zu ändern.</Card.Description
			>
		</Card.Header>

		<Card.Footer class="border-t px-6 py-4">
			<Button>Passwort ändern</Button>
		</Card.Footer>
	</Card.Root>
</div>
