// Function to fill the remaining array elements with profilePic
export const fillArrayWithProfilePic = (group) => {
	const filledArray = [...group.users]; // Create a copy of the original array

	// Check if the array length is less than 4
	while (filledArray.length < 4) {
		// Add a default user object with profilePic field to the array
		filledArray.push({
			profilePic: null,
			firstName: "John",
			lastName: "Doe",
			_id: Math.random().toString(),
		});
	}

	return filledArray;
};
