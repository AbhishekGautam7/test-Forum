import { useMutation, useQueryClient } from "@tanstack/react-query";

import { headers } from "../../../api/community";
import { useDispatch, useSelector } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function useLeaveGroup({ groupId }) {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);

	const leaveGroup = () => {
		let url = `${API_URL}/api/group/leave-group`;

		return axios.post(
			url,
			{
				groupId,
			},
			{
				headers: headers({ token, appId }),
			}
		);
	};

	const { isLoading, mutate, mutateAsync } = useMutation(leaveGroup, {
		onSuccess: (data) => {
			queryClient.invalidateQueries("communityGroupList");
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

export { useLeaveGroup };
