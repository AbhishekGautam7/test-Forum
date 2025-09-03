export const getFullNameInitials = (fullName) => {
	const nameParts = fullName?.split(" ");

	if (nameParts?.length >= 2) {
		const firstName = nameParts[0];
		const lastName = nameParts[nameParts.length - 1];

		const firstInitial = firstName.charAt(0);
		const lastInitial = lastName.charAt(0);

		const initials = firstInitial + lastInitial;

		return initials.toUpperCase();
	} else {
		return fullName?.[0]?.toUpperCase();
	}
};
