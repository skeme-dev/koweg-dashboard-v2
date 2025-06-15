import { z } from 'zod';

enum Roles {
	TRAINER = 'Trainer',
	DEPARTMENT_LEADER = 'Abteilungsleiter',
	ADMIN = 'Admin'
}

export const RoleEnum = z.nativeEnum(Roles);

const baseScheme = z.object({
	collectionId: z.string(),
	collectionName: z.string(),
	created: z.string(),
	updated: z.string()
});

export const teamScheme = z
	.object({
		id: z.string(),
		title: z.string().min(3),
		description: z.string(),
		trainers: z.array(z.string()),
		team_image: z.string(),
		department: z.string(),
		training_schedule: z.array(z.string()),
		events: z.array(z.string()),
		relatedPosts: z.array(z.string())
	})
	.merge(baseScheme);
