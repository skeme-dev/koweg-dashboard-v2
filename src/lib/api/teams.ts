import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { z } from 'zod';
import { sendFormData } from './helpers';

const TEAM_BASE_URL = PUBLIC_POCKETBASE_URL + '/api/collections/teams/records';

// async function createTeam(cb: () => any) {
//     const request = await fetch(TEAM_BASE_URL, {
//         method: "POST",

//     })
// }

const teamSchema = z.object({
	name: z.string().min(1, 'Name ist erforderlich'),
	description: z.string().min(1, 'Beschreibung ist erforderlich'),
	trainers: z.array(z.string()).nonempty('Mindestens ein Trainer erforderlich'),
	events: z.array(z.string()),
	relatedPosts: z.array(z.string()),
	team_image: z.string(),
	department: z.string().min(1, 'Abteilung ist erforderlich')
});

function createTeam(departmentId: string, data: any, cb: () => any, onError: (error) => any) {
	const validation = teamSchema.safeParse(data);

	if (!departmentId) {
		return onError(new Error('Abteilungs-ID sind erforderlich'));
	}

	// if (!validation.success) {
	// 	return onError(new Error(validation.error.message));
	// }

	sendFormData('/departments/' + departmentId + '?/createTeam', data)
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(error);
		});
}

function updateTeam(teamId: string, data: any, cb: () => any, onError: (error: Error) => any) {
	const validation = teamSchema.safeParse(data);

	if (!teamId) {
		return onError(new Error('Team-ID ist erforderlich'));
	}

	if (!validation.success) {
		return onError(new Error(validation.error.message));
	}

	sendFormData('/teams/' + teamId + '?/updateTeam', data)
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(error);
		});
}

async function deleteTeam(teamId: string, cb: () => any, onError: (error: Error) => any) {
	if (!teamId) return;

	const request = await fetch(TEAM_BASE_URL + '/' + teamId, {
		method: 'DELETE',
		body: JSON.stringify({
			id: teamId
		})
	});

	const response = await request.json();

	if (response.code) {
		console.log(response);
		return onError(new Error(response.message));
	}

	return cb();
}

function changeTeamImage(
	teamId: string,
	image: File,
	cb: () => any,
	onError: (error: Error) => any
) {
	const validation = teamSchema.pick({ team_image: true }).safeParse({ team_image: image.name });

	if (!image) {
		return onError(new Error('Bild ist kein File-Objekt'));
	}

	if (!image.type.startsWith('image')) {
		return onError(new Error('Datei ist kein Bild'));
	}

	if (!validation.success) {
		return onError(new Error(validation.error.message));
	}

	sendFormData('/teams/' + teamId + '?/updateTeam', { team_image: image })
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(error);
		});
}

export { createTeam, updateTeam, deleteTeam, changeTeamImage, teamSchema };
