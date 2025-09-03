export const getFileExtension = (url) => {
	// Extract the part of the URL after the last dot
	const dotIndex = url.lastIndexOf(".");
	if (dotIndex === -1) {
		// If there's no dot in the URL, return an empty string or handle it as needed
		return "";
	}

	// Get the substring starting from the last dot to the end of the string
	const extension = url.substring(dotIndex + 1);

	return extension;
};

export const getFileExtensionFromType = (type) => {
	const splittedType = type.split("/");

	return splittedType[1];
};
