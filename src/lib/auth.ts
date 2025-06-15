import { redirect } from '@sveltejs/kit';
import PocketBase, { BaseAuthStore } from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export async function checkIfAdmin(user: any) {
	if (!user) {
		await redirect(303, '/');
	} else if (user.role !== 'ADMIN') {
		await redirect(303, '/');
	}
}

/**
 * Prüft, ob der Benutzer eingeloggt ist.
 * Falls `requireAdmin` true ist, prüft die Funktion zusätzlich auf Admin-Rechte.
 */
export async function guard({ url, authStore }: { url: URL; authStore: BaseAuthStore }) {
	// Aktualisiere die Auth-Session

	if (!authStore.isValid) {
		throw redirect(303, `/login?redirect=${url.pathname}`);
	}

	const user = authStore.record;

	// Falls Admin-Rechte erforderlich sind

	return { user };
}
