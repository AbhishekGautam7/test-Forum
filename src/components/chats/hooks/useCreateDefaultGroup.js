import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDefaultGroup } from "../../../api";
import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

function useCreateDefaultGroup() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const { mutate, mutateAsync, isLoading } = useMutation({
		mutationFn: createDefaultGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["communityGroupList"] });
		},
		onError: (error) => {
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

export { useCreateDefaultGroup };
