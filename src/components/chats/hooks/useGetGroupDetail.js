import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import { getGroupMessages } from "../../../api";

function useGetGroupDetail({ groupId, activeTab }) {
	const [groupMessages, setGroupMessages] = useState([]);
	const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);
	const [overAllSetting, setOverAllSetting] = useState(null);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);
	const [groupDetail, setGroupDetail] = useState(null);
	const [lastMessageId, setLastMessageId] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [groupLastMessageId, setGroupLastMessageId] = useState(null);
	const [hasIseenGroupLastMessage, setHasIseenGroupLastMessage] =
		useState(null);
	const [lastMessageSeenUsers, setLastMessageSeenUsers] = useState(null);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(12);

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
	} = useInfiniteQuery(
		["groupMessages", { communityId, groupId }],
		({ pageParam = 1 }) =>
			getGroupMessages({
				communityId,
				page: pageParam,
				groupId,
				limit: pageLimit,
				appId,
				token,
			}),
		{
			getNextPageParam: (_lastPage, pages) => {
				let messageCount = pages[0]?.data?.data?.totalMessages;

				const totalPages = Math.ceil(messageCount / pageLimit);

				if (pages.length < totalPages) {
					return pages.length + 1;
				} else {
					return undefined;
				}
			},
			refetchOnWindowFocus: false,
			enabled: !!communityId && !!groupId && activeTab === "groups",
		}
	);

	useEffect(() => {
		if (isSuccess) {
			let allMessages = [];

			setHasIseenGroupLastMessage(
				data?.pages[0]?.data?.data?.messageSeenDetails?.hasIseenGroupLastMessage
			);

			setLastMessageSeenUsers(
				data?.pages[0]?.data?.data?.messageSeenDetails?.seenUsers
			);

			setLastMessageId(
				data?.pages[0]?.data?.data?.messageSeenDetails?.lastSeenMessage
			);

			setGroupLastMessageId(data?.pages[0]?.data?.data?.messages[0]?._id);

			setTotalOnlineUsers(data?.pages[0]?.data?.data?.group?.totalOnlineUsers);

			setOverAllSetting(data?.pages[0]?.data?.data?.group?.overallSetting);

			setGroupDetail(data?.pages[0]?.data?.data?.group);

			data?.pages?.map((page, index) => {
				setCurrentPage(index + 1);
				return page?.data?.data?.messages?.map(async (message) => {
					if (message?.isComment) {
						return allMessages.push({
							...message,
							parentMessage: {
								...message.parentMessage,
							},
						});
					} else {
						return allMessages.push({
							...message,
						});
					}
				});
			});

			setGroupMessages(allMessages);
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
		lastMessageSeenUsers,
		setLastMessageSeenUsers,
		isLoading,
		groupMessages,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setGroupMessages,
		totalOnlineUsers,
		setTotalOnlineUsers,
		overAllSetting,
		groupDetail,
		lastMessageId,
		setLastMessageId,
		currentPage,
		groupLastMessageId,
		hasIseenGroupLastMessage,
	};
}

export { useGetGroupDetail };
