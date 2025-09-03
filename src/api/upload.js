export async function uploadFileWithFolder(data) {
	const response = await fetch(
		"https://awsuploader.services.olive.media/uploadFileWithFolder",
		{
			method: "POST",
			body: data,
		}
	);

	return response.json();
}

export async function uploadFile(data) {
	const response = await fetch(
		"https://awsuploader.services.olive.media/upload",
		{
			method: "POST",
			body: data,
		}
	);

	return response.json();
}
