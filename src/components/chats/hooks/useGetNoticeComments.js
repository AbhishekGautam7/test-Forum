import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { headers } from "../../../api/community";
import axios from "axios";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const useGetNoticeComments = ({ messageId, activeTab, selectedNotice }) => {
	const [noticeComments, setNoticeComments] = useState([]);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);
	const [totalComments, setTotalComments] = useState(0);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(5);

	const getNoticeComments = ({ pageParam = 1 }) => {
		let url = `${API_URL}/api/group/notice-comments?page=${pageParam}&limit=${pageLimit}&communityId=${communityId}&messageId=${messageId}`;

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
		refetch,
	} = useInfiniteQuery(
		["noticeComments", { communityId, selectedNotice }],
		getNoticeComments,
		{
			getNextPageParam: (_lastPage, pages) => {
				let messageCount = pages[0].data.data.totalComments;

				const totalPages = Math.ceil(messageCount / pageLimit);

				if (pages.length < totalPages) {
					return pages.length + 1;
				} else {
					return undefined;
				}
			},

			refetchOnWindowFocus: false,
			enabled: messageId === selectedNotice && activeTab === "notices",
		}
	);

	useEffect(() => {
		if (isSuccess) {
			let allComments = [];

			setTotalComments(data?.pages[0]?.data?.data?.totalComments);

			data?.pages.map((page) => {
				return page.data.data.comments.map(async (comment) => {
					return allComments.push({
						...comment,
					});
				});
			});

			setNoticeComments(allComments);
		}
	}, [appId, communityUsers, data, isSuccess, token]);

	return {
		isSuccess,
		isLoading,
		noticeComments,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setNoticeComments,
		data,
		totalComments,
		refetch,
		setTotalComments,
	};
};

export { useGetNoticeComments };
