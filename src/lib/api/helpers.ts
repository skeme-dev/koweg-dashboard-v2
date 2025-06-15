export async function sendFormData(url: string, data: any) {
	return new Promise(async (resolve, reject) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			formData.append(key, value);
		});

		try {
			const response = await fetch(url, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(`HTTP-Fehler! Status: ${response.status}`);
			}

			const result = await response.json();
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
}
