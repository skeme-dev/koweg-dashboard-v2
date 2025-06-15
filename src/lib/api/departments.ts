import { z } from 'zod';
import { sendFormData } from './helpers';

const departmentSchema = z.object({
	label: z.string().min(1, 'Name ist erforderlich'),
	description: z.string().min(1, 'Beschreibung ist erforderlich'),
	leader: z.string(),
	events: z.array(z.string()),
	teams: z.array(z.string()),
	relatedPosts: z.array(z.string())
});

function createDepartment(data: any, cb: (id: string) => any, onError: (error: Error) => any) {
	// const validation = departmentSchema.safeParse(data);

	// if (!validation.success) {
	// 	return onError(new Error(validation.error.message));
	// }

	sendFormData('/departments?/createDepartment', data)
		.then((result) => {
			return cb(result.data);
		})
		.catch((error) => {
			return onError(error);
		});
}

function updateDepartment(
	departmentId: string,
	data: any,
	cb: () => any,
	onError: (error: Error) => any
) {
	// const validation = departmentSchema.safeParse(data);

	if (!departmentId) {
		return onError(new Error('Abteilungs-ID ist erforderlich'));
	}

	// if (!validation.success) {
	// 	return onError(new Error(validation.error.message));
	// }

	sendFormData('/departments/' + departmentId + '?/updateDepartment', data)
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(error);
		});
}

function deleteDepartment(departmentId: string, cb: () => any, onError: (error) => any) {
	if (!departmentId) {
		return onError(new Error('Abteilungs-ID ist erforderlich'));
	}

	sendFormData('/departments/' + departmentId + '?/deleteDepartment', {})
		.then(() => {
			return cb();
		})
		.catch((error) => {
			return onError(new Error(error.message));
		});
}

export { createDepartment, updateDepartment, deleteDepartment };
