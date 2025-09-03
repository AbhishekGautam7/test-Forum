import React, { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";
import { getFileExtension } from "../../../../libary/extractExtensionFromUrl";
import { useGetGroupDetail } from "../../hooks";

import ChatFooter from "../../chatDetail/chatFooter";
import { useFileUpload } from "../../hooks/useFileUpload";
import GroupDetailBody from "./groupDetailBody";
import GroupDetailHeader from "./groupDetailHeader";

const GroupDetail = ({
	setIsGroupSettingBoxOpen,
	socket,
	setIsGroupDetailBoxOpen,
	groupInfo,
	setGroupInfo,
	activeTab,
	setCommunityGroupList,
	communityGroupList,
}) => {
	const {
		groupMessages,
		fetchNextPage,
		hasNextPage,
		setGroupMessages,
		totalOnlineUsers,
		setTotalOnlineUsers,
		overAllSetting,
		isLoading,
		lastMessageId,
		setLastMessageId,
		lastMessageSeenUsers,
		setLastMessageSeenUsers,
		currentPage,
	} = useGetGroupDetail({
		groupId: groupInfo?.id,
		activeTab,
	});
	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const userId = useSelector((state) => state.info.userId);

	const scroll = useRef();

	const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);

	const [userMessage, setUserMessage] = useState("");

	const [typingUser, setTypingUser] = useState(null);

	const { error, fileInputRef, files, isUploading, setFiles } = useFileUpload();

	//Run only once
	useEffect(() => {
		if (groupInfo && currentPage === 1) {
			socket.emit("groupMessageSeen", { groupId: groupInfo?.id }, (res) => {
				console.log("seen", res);
			});
		}
		// return socket.disconnect();
	}, [currentPage, groupInfo, socket]);

	useEffect(() => {
		let activityTimer;

		const handleGroupOnlineUsersCount = (data) => {
			if (groupInfo?.id === data?._id) {
				setTotalOnlineUsers(data?.totalOnlineUsers);
			}
		};

		const handleComment = (data) => {
			const isOwnMessage = data.comment.sender === userId;

			const communityGroupListCopy = [...communityGroupList];

			const updatedList = communityGroupListCopy.map((state) =>
				state._id === data?.comment?.groupReceiver
					? {
							...state,
							lastMessage: data?.comment,
					  }
					: state
			);

			setCommunityGroupList(updatedList);

			if (groupInfo?.id === data.comment.groupReceiver) {
				const newComment = {
					...data.comment,
					isOwnMessage,
					parentMessage: {
						...data.comment.parentMessage,
					},
				};
				setGroupMessages((prevState) => [newComment, ...prevState]);
				if (!isOwnMessage) {
					setLastMessageId(data?.comment?._id);
					setLastMessageSeenUsers([data?.comment?.senderDetails]);
					socket.emit(
						"groupMessageSeen",
						{ groupId: data?.comment?.groupReceiver },
						(res) => {
							console.log("seen", res);
						}
					);
				}
			}
		};

		const handleReceiveGroupMessage = (data) => {
			const isOwnMessage = data.message.sender === userId;

			const communityGroupListCopy = [...communityGroupList];

			const updatedList = communityGroupListCopy.map((state) =>
				state._id === data?.message?.groupReceiver
					? {
							...state,
							lastMessage: data?.message,
					  }
					: state
			);

			setCommunityGroupList(updatedList);

			if (groupInfo?.id === data?.message?.groupReceiver) {
				const newMessage = {
					...data.message,
					isOwnMessage,
				};
				setGroupMessages((prevState) => [newMessage, ...prevState]);

				if (!isOwnMessage) {
					setLastMessageId(data?.message?._id);
					setLastMessageSeenUsers([data?.message?.senderDetails]);
					socket.emit(
						"groupMessageSeen",
						{ groupId: data?.message?.groupReceiver },
						(res) => {
							console.log("seen", res);
						}
					);
				}
			}
		};

		const handleGroupMessageTyping = (data) => {
			const writer = communityUsers.find((user) => user._id === data.typingBy);
			setTypingUser(writer);
			clearTimeout(activityTimer);
			activityTimer = setTimeout(() => {
				setTypingUser(null);
			}, 3000);
		};

		const handleGroupMessageSeen = (data) => {
			if (groupInfo?.id === data?.group) {
				if (data?.lastMessageId === lastMessageId) {
					setLastMessageSeenUsers((prevState) => [...prevState, data?.seenBy]);
				} else {
					setLastMessageId(data?.lastMessageId);
					setLastMessageSeenUsers([data?.seenBy]);
				}
			}
		};

		socket.on("groupMessageSeen", handleGroupMessageSeen);

		socket.on("groupOnlineUsersCount", handleGroupOnlineUsersCount);
		socket.on("comment", handleComment);
		socket.on("receiveGroupMessage", handleReceiveGroupMessage);
		socket.on("groupMessageTyping", handleGroupMessageTyping);

		return () => {
			socket.off("groupMessageSeen", handleGroupMessageSeen);
			socket.off("receiveGroupMessage", handleReceiveGroupMessage);
			socket.off("groupMessageTyping", handleGroupMessageTyping);
			socket.off("comment", handleComment);
			socket.off("groupOnlineUsersCount", handleGroupOnlineUsersCount);
		};
	}, [
		communityGroupList,
		communityUsers,
		groupInfo?.id,
		lastMessageId,
		lastMessageSeenUsers,
		selectedMessageForReply,
		setCommunityGroupList,
		setGroupMessages,
		setLastMessageId,
		setLastMessageSeenUsers,
		setTotalOnlineUsers,
		socket,
		userId,
	]);

	const sendComment = (messageId, comment, type) => {
		socket.emit("comment", { messageId, comment, type }, (res) => {
			console.log("replyRes", res);
		});
	};

	const sendGroupMessage = (groupId, communityId, type, message) => {
		socket.emit(
			"sendGroupMessage",
			{ groupId, communityId, type, message },
			(res) => {
				console.log("res", res);
			}
		);
	};

	const sendMessage = () => {
		const isTextMessage = userMessage !== "" && userMessage[0] !== " ";
		const hasFiles = files.length > 0;
		if (isTextMessage) {
			if (selectedMessageForReply) {
				sendComment(selectedMessageForReply?._id, [userMessage], "text");
				setSelectedMessageForReply(null);
			} else {
				sendGroupMessage(groupInfo?.id, groupInfo?.communityId, "text", [
					userMessage,
				]);
			}
			setUserMessage("");
		}

		if (hasFiles) {
			if (selectedMessageForReply) {
				files.forEach((file) =>
					sendComment(
						selectedMessageForReply?._id,
						[file],
						getFileExtension(file)
					)
				);
				setSelectedMessageForReply(null);
			} else {
				files.forEach((file) =>
					sendGroupMessage(
						groupInfo?.id,
						groupInfo?.communityId,
						getFileExtension(file),
						[file]
					)
				);
			}
			setFiles([]);
		}

		scroll.current.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest",
		});
	};

	// Usage
	const writeMessage = (e) => {
		setUserMessage(e.target.value);
	};

	useEffect(() => {
		let delayDebounceFn;

		if (userMessage) {
			delayDebounceFn = setTimeout(() => {
				socket.emit(
					"groupMessageTyping",
					{
						groupId: groupInfo?.id,
					},
					(res) => console.log("typing")
				);
			}, 500);
		}

		return () => clearTimeout(delayDebounceFn);
	}, [groupInfo?.id, socket, userMessage]);

	return (
		<>
			<GroupDetailHeader
				groupInfo={groupInfo}
				overAllSetting={overAllSetting}
				setGroupInfo={setGroupInfo}
				setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
				setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
				socket={socket}
				totalOnlineUsers={totalOnlineUsers}
				key="groupDetailHeaders"
			/>
			<GroupDetailBody
				fetchNextPage={fetchNextPage}
				isLoading={isLoading}
				groupMessages={groupMessages}
				hasNextPage={hasNextPage}
				overAllSetting={overAllSetting}
				lastMessageId={lastMessageId}
				lastMessageSeenUsers={lastMessageSeenUsers}
				scroll={scroll}
				setGroupMessages={setGroupMessages}
				setSelectedMessageForReply={setSelectedMessageForReply}
				socket={socket}
				typingUser={typingUser}
				key="groupDetailBody"
			/>
			<ChatFooter
				selectedMessageForReply={selectedMessageForReply}
				sendMessage={sendMessage}
				setSelectedMessageForReply={setSelectedMessageForReply}
				userMessage={userMessage}
				writeMessage={writeMessage}
				error={error}
				fileInputRef={fileInputRef}
				files={files}
				isUploading={isUploading}
				setFiles={setFiles}
				key="groupDetailFooter"
				overAllSetting={overAllSetting}
			/>
		</>
	);
};

export default React.memo(GroupDetail);
