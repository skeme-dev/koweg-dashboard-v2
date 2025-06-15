export function updateDepartment(data: any) {
	const ENDPOINT: string = '/departments?/update';

	const formData = new FormData();
	formData.set('label', data.label);
	formData.set('description', data.description);
	formData.set('leader', data.leaderId);
	formData.set('teams', data.teams);
}

export function updateTeam() {}

export function updateUser() {}
