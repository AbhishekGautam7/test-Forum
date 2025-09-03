import { useState, useEffect } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import axios from "axios";
import { headers } from "../../../api/community";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

const useGetPrivateChatDetail = ({ participantId, activeTab }) => {
	const [privateChatDetail, setPrivateChatDetail] = useState([]);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);
	const [lastSeenMessageId, setLastSeenMessageId] = useState("");
	const [lastMessageId, setLastMessageId] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [hasIseenGroupLastMessage, setHasIseenGroupLastMessage] =
		useState(null);
	const [lastMessageSeenUser, setLastMessageSeenUser] = useState(null);

	const [peerConversationId, setPeerConversationId] = useState("");

	const [chatStatus, setChatStatus] = useState(null);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(12);

	const getPrivateChatDetails = ({ pageParam = 1 }) => {
		let url = `${API_URL}/api/privateMessage/${communityId}/${participantId}?page=${pageParam}&limit=${pageLimit}`;

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
	} = useInfiniteQuery(
		["privateChatDetail", { communityId, participantId }],
		getPrivateChatDetails,
		{
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
			enabled: !!communityId && !!participantId && activeTab === "chats",
		}
	);

	useEffect(() => {
		if (isSuccess) {
			let allMessages = [];

			setChatStatus(data?.pages[0]?.data?.data?.onlineStatus);

			setHasIseenGroupLastMessage(
				data?.pages[0]?.data?.data?.messageSeenDetails?.hasIseenGroupLastMessage
			);

			setLastMessageSeenUser(
				data?.pages[0]?.data?.data?.messageSeenDetails?.seenUser
			);

			setLastSeenMessageId(
				data?.pages[0]?.data?.data?.messageSeenDetails?.lastSeenMessage
			);

			setLastMessageId(data?.pages[0]?.data?.data?.messages[0]?._id);

			setPeerConversationId(data?.pages[0]?.data?.data?.peerConversation?._id);

			data?.pages.map((page, index) => {
				setCurrentPage(index + 1);
				return page.data.data.messages.map(async (message) => {
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

			setPrivateChatDetail(allMessages);
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
		privateChatDetail,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setPrivateChatDetail,
		data,
		chatStatus,
		setChatStatus,
		lastMessageId,
		lastSeenMessageId,
		setLastMessageId,
		setLastSeenMessageId,
		currentPage,
		setCurrentPage,
		hasIseenGroupLastMessage,
		setHasIseenGroupLastMessage,
		lastMessageSeenUser,
		setLastMessageSeenUser,
		peerConversationId,
		setPeerConversationId,
	};
};

export { useGetPrivateChatDetail };
