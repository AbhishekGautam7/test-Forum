export const findUserInList = ({ userList, userId }) => {
	return userList.find((user) => user._id === userId);
};
