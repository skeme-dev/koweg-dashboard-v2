// ordentlich JSON validation

import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { teamSchema } from '$lib/api/teams';

export const load = (async ({ params, locals }) => {
	const users = await locals.pb.collection('users').getFullList({ sort: '-created' });
	const team = await locals.pb.collection('teams').getOne(params.teamId, {
		expand: 'trainers,events,trainings_schedule,poi'
	});

	const events = await locals.pb.collection('events').getList(1, 10, {
		filter: locals.pb.filter('corresponding_teams ~ {:id}', { id: params.teamId })
	});

	// set file object as url
	const fileUrl = locals.pb.files.getURL(team, team.team_image, {
		thumb: '300x200'
	});

	team.team_image = fileUrl;

	const trainings = await locals.pb.collection('trainings').getList(1, 10, {
		filter: locals.pb.filter('team ?= {:id}', { id: params.teamId })
	});
	return { team, trainings, users, events };
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateTeam: async ({ request, locals, params }) => {
		const keys = [
			'name',
			'description',
			'trainers',
			'events',
			'relatedPosts',
			'team_image',
			'department'
		];

		const form = await request.formData();
		const teamId = params.teamId as string;

		let data = {};

		for (const key of keys) {
			if (form.has(key)) {
				data[key] = form.getAll(key).length == 1 ? form.get(key) : form.getAll(key);
			}
		}

		console.log(data);

		try {
			await locals.pb.collection('teams').update(teamId, data);
			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},
	createTrainingSchedule: async ({ request, locals, params }) => {
		const form = await request.formData();

		try {
			const created = await locals.pb.collection('trainings').create(
				{
					day: form.get('day'),
					location_label: form.get('location'),
					location_url: form.get('location_url'),
					start: form.get('time_start'),
					end: form.get('time_end'),
					team: params.teamId
				},
				{
					expand: 'team'
				}
			);

			await locals.pb.collection('teams').update(created.expand.team.id, {
				'training_schedule+': [created.id]
			});

			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},
	deleteTrainingSchedule: async ({ request, locals, params }) => {
		const form = await request.formData();

		const id = form.get('trainingScheduleId') as string;

		try {
			await locals.pb.collection('teams').update(params.teamId as string, {
				'training_schedule-': [id]
			});

			await locals.pb.collection('trainings').delete(id);

			return { success: true };
		} catch (error) {
			console.error(error);
			return { error: true };
		}
	},
	addTrainer: async ({ request, locals, params }) => {
		const form = await request.formData();

		const trainerIds: any[] = form.getAll('box');

		try {
			const data = {
				'trainers+': trainerIds
			};
			await locals.pb.collection('teams').update(params.teamId as string, data);
			return {
				success: true
			};
		} catch (error) {
			return { error: true };
		}
	},
	deleteTrainer: async ({ request, locals, params }) => {
		const form = await request.formData();

		const trainerId = form.get('trainerId');

		try {
			const data = {
				'trainers-': trainerId
			};

			await locals.pb.collection('teams').update(params.teamId as string, data);

			return { success: true };
		} catch (error) {
			return { error: true, msg: error };
		}
	},
	addPOI: async ({ request, locals, params }) => {
		const form = await request.formData();
		const teamId = params.teamId as string;

		const data = {
			name: form.get('name'),
			function: form.get('function'),
			email: form.get('email')
		};

		let created;

		try {
			created = await locals.pb.collection('poi').create(data);

			console.log(created.id);

			await locals.pb.collection('teams').update(teamId, { 'relatedPOI+': [created.id] });
		} catch (error) {
			console.error(error);

			return fail(400, { message: 'Unable to create poi or update team' });
		}

		return { success: true };
	}
};
