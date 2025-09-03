import { useMutation, useQueryClient } from "@tanstack/react-query";

import { headers } from "../../../api/community";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

const API_URL = process.env.REACT_APP_API_URL;

function useBlockUnBlockUser() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const currentCommunity = useSelector((state) => state.currentCommunity.data);

	const createDefaultCommunity = (payload) => {
		let url = `${API_URL}/api/community/user/block-unblock-user?communityId=${currentCommunity?._id}`;

		return axios.post(
			url,
			{
				...payload,
				communityId: currentCommunity?._id,
			},
			{
				headers: headers({ token, appId }),
			}
		);
	};

	const { isLoading, mutate, mutateAsync } = useMutation(
		createDefaultCommunity,
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries("blockedUnBlockedUserList");
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

export { useBlockUnBlockUser };
