import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { headers } from "../../../api/community";
import axios from "axios";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const useGetPrivateChats = ({ activeTab, setPrivateChats }) => {
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.currentCommunity.data._id);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(12);

	const getPrivateChats = ({ pageParam = 1 }) => {
		let url = `${API_URL}/api/privateMessage/${communityId}?page=${pageParam}&limit=${pageLimit}`;

		return axios.get(url, {
			headers: headers({ token, appId }),
		});
	};

	const {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
		hasNextPage,
		isFetchingNextPage,
		isFetching,
		fetchNextPage,
	} = useInfiniteQuery(["privateChats", { communityId }], getPrivateChats, {
		getNextPageParam: (_lastPage, pages) => {
			let messageCount = pages[0].data.data.total;

			const totalPages = Math.ceil(messageCount / pageLimit);

			if (pages.length < totalPages) {
				return pages.length + 1;
			} else {
				return undefined;
			}
		},
		refetchOnWindowFocus: false,
		enabled: activeTab === "chats" && !!communityId,
	});

	useEffect(() => {
		if (isSuccess) {
			let allMessages = [];

			data?.pages.map((page) => {
				return page.data.data.chats.map(async (chat) => {
					return allMessages.push({
						...chat,
					});
				});
			});

			setPrivateChats(allMessages);
		}
	}, [appId, communityUsers, data, isSuccess, setPrivateChats, token]);

	// useEffect(() => {
	// 	if (isError) {
	// 		Notification({
	// 			message: "Unable to get group list, please try again later",
	// 			type: "warning",
	// 			title: "Warning",
	// 		});
	// 	}
	// }, [error, isError]);

	return {
		isSuccess,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setPrivateChats,
	};
};

export { useGetPrivateChats };
