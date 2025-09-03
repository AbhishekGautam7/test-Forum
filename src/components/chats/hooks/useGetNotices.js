import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { headers } from "../../../api/community";
import axios from "axios";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const useGetNotices = ({ activeTab }) => {
	const [notices, setNotices] = useState(null);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);
	const [currentPage, setCurrentPage] = useState(0);

	const [defaultGroup, setDefaultGroup] = useState(null);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(10);

	const getNotices = ({ pageParam = 1 }) => {
		let url = `${API_URL}/api/group/notices?page=${pageParam}&limit=${pageLimit}&communityId=${communityId}&commentLimit=5`;

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
	} = useInfiniteQuery(["notices", { communityId }], getNotices, {
		getNextPageParam: (_lastPage, pages) => {
			let messageCount = pages[0].data.data.totalMessages;

			const totalPages = Math.ceil(messageCount / pageLimit);

			if (pages.length < totalPages) {
				return pages.length + 1;
			} else {
				return undefined;
			}
		},
		refetchOnWindowFocus: false,
		enabled: activeTab === "notices" && !!communityId,
	});

	useEffect(() => {
		if (isSuccess) {
			let allMessages = [];

			setDefaultGroup(data?.pages[0]?.data?.data?.group);
			data?.pages.map((page, index) => {
				setCurrentPage(index + 1);
				return page.data.data.messages.map(async (message) => {
					return allMessages.push({
						...message,
					});
				});
			});

			setNotices(allMessages);
		}
	}, [appId, communityUsers, data, isSuccess, token]);

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
		notices,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setNotices,
		data,
		defaultGroup,
		currentPage,
		setCurrentPage,
	};
};

export { useGetNotices };
