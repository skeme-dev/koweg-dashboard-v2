<script lang="ts">
	import type { PageProps } from './$types';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Login | SV Koweg e.V.</title>
</svelte:head>

<div class="w-full h-screen lg:grid lg:grid-cols-2">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Login</h1>
				<p class="text-muted-foreground text-balance">Anmeldedaten eingeben, um dich anzumelden</p>
			</div>
			<div>
				<form class="grid gap-4" action="?/login" method="post" use:enhance>
					{#if form?.error}
						<p class="error">{form?.message}</p>
					{/if}
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							name="email"
							id="email"
							value={form?.email ?? ''}
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Passwort</Label>
						</div>
						<Input name="password" id="password" type="password" required />
					</div>
					<Button type="submit" class="w-full">Anmelden</Button>
				</form>
			</div>
			<div class="mt-4 text-center text-sm">
				<a href="##" class="underline"> Passwort vergessen? </a>
			</div>
		</div>
	</div>
	<div class="bg-muted hidden lg:block h-screen">
		<!-- <img
			src="https://images.unsplash.com/photo-1739369763175-f37f9d898ce4?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="placeholder"
			class="object-contain dark:brightness-[0.2] dark:grayscale"
		/> -->
	</div>
</div>
