import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateGroup } from "../../../api";
import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

function useUpdateGroup() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const { isLoading, mutate, mutateAsync } = useMutation(updateGroup, {
		onSuccess: (data) => {
			queryClient.invalidateQueries("overAllChatSettings");
			queryClient.invalidateQueries("groupChatSettings");
			queryClient.invalidateQueries("groupMessages");

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
	});

	return {
		mutate,
		isLoading,
		mutateAsync,
	};
}

export { useUpdateGroup };
