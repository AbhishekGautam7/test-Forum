import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addOrRemoveGroupUsers, updateGroup } from "../../../api";
import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

function useAddOrRemoveGroupUsers() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const { isLoading, mutate, mutateAsync } = useMutation(
		addOrRemoveGroupUsers,
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries("communityGroupUserList");
				if (data?.data?.metadata) {
					dispatch(setMessageTxt(data?.data?.metadata?.message));
				} else {
					dispatch(setMessageTxt(data?.data?.message));
				}
				setTimeout(() => {
					dispatch(setMessageBox(false));
				}, 1500);
			},
			onError(error, variables, context) {
				console.log("error", error);
				dispatch(setMessageTxt(JSON.stringify(error, null)));
				setTimeout(() => {
					dispatch(setMessageBox(false));
				}, 1500);
			},
		}
	);

	return {
		mutate,
		isLoading,
		mutateAsync,
	};
}

export { useAddOrRemoveGroupUsers };
