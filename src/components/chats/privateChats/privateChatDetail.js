import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import { useSelector } from "react-redux";
import { getFileExtension } from "../../../libary/extractExtensionFromUrl";
import { Avatar, TypingIndicator } from "../../modules";

import ChatFooter from "../chatDetail/chatFooter";
import ChatStatus from "../groupChats/chatStatus";
import { useFileUpload } from "../hooks/useFileUpload";
import { useGetPrivateChatDetail } from "../hooks/useGetPrivateChatDetail";
import InfiniteScroller from "../modules/infiniteScroller";
import SingleMessage from "./singleMessage";
import { useIsMobileView } from "../../../hooks/index";

const PrivateChatDetail = ({
  setPrivateChatInfo,
  socket,
  privateChatInfo,
  chatSetting,
  activeTab,
}) => {
  const {
    privateChatDetail,
    setPrivateChatDetail,
    fetchNextPage,
    hasNextPage,
    setTotalOnlineUsers,
    chatStatus,
    setChatStatus,
    lastMessageId,
    setLastMessageId,
    currentPage,
    hasIseenGroupLastMessage,
    lastMessageSeenUser,
    setLastMessageSeenUser,
    peerConversationId,
    setPeerConversationId,
  } = useGetPrivateChatDetail({
    participantId: privateChatInfo?.info?.participantDetails?._id,
    activeTab,
  });

  const { isMobileView } = useIsMobileView({});

  const communityUsers = useSelector(
    (state) => state.currentCommunity.data.communityUsers
  );

  const userId = useSelector((state) => state.info.userId);

  const scroll = useRef();

  const [selectedMessageForReply, setSelectedMessageForReply] = useState(null);

  const [userMessage, setUserMessage] = useState("");

  const [typingUser, setTypingUser] = useState(null);

  const [isAPICall, setStartAPICall] = useState(false);

  const { error, fileInputRef, files, isUploading, setFiles } = useFileUpload();

  const leaveRoom = ({ communityId, participantId }) => {
    socket.emit(
      "exitPrivateChat",
      {
        communityId,
        otherParticipantId: participantId,
      },
      (res) => console.log("leftPrivateChat", res)
    );
  };

  //Run only once
  useEffect(() => {
    if (peerConversationId && currentPage === 1) {
      socket.emit(
        "privateMessageSeen",
        { peerConvId: peerConversationId },
        (res) => {
          console.log("seen", res);
        }
      );
    }
    // return socket.disconnect();
  }, [currentPage, peerConversationId, socket]);

  useEffect(() => {
    let activityTimer;

    const handlePrivateChatOnline = (data) => {
      if (peerConversationId === data?.peerConversation) {
        setChatStatus(data);
      }
    };

    const handleComment = (data) => {
      const isOwnMessage = data.comment.sender === userId;

      if (peerConversationId === data?.comment?.peerConversation) {
        const newComment = {
          ...data.comment,
          isOwnMessage,
          parentMessage: {
            ...data.comment.parentMessage,
          },
        };
        setPrivateChatDetail((prevState) => [newComment, ...prevState]);
        if (!isOwnMessage) {
          setLastMessageId(data?.comment?._id);
          setLastMessageSeenUser(data?.comment?.senderDetails);
          socket.emit(
            "privateMessageSeen",
            { peerConvId: data?.comment?.peerConversation },
            (res) => {
              console.log("seen", res);
            }
          );
        }
      }
    };

    const handleReceivePrivateMessage = (data) => {
      const isOwnMessage = data?.message?.sender === userId;

      if (peerConversationId === data?.message?.peerConversation) {
        const newMessage = {
          ...data.message,
          isOwnMessage,
        };
        setPrivateChatDetail((prevState) => [newMessage, ...prevState]);

        if (!isOwnMessage) {
          setLastMessageId(data?.message?._id);
          setLastMessageSeenUser(data?.message?.senderDetails);
          socket.emit(
            "privateMessageSeen",
            { peerConvId: data?.message?.peerConversation },
            (res) => {
              console.log("seen", res);
            }
          );
        }
      }
    };

    const handlePrivateMessageTyping = (data) => {
      const writer = communityUsers.find((user) => user._id === data.typingBy);
      setTypingUser(writer);
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        setTypingUser(null);
      }, 3000);
    };

    const handlePrivateMessageSeen = (data) => {
      if (peerConversationId === data?.peerConversation) {
        setLastMessageId(data?.lastMessageId);
        setLastMessageSeenUser(data?.seenBy);
      }
    };

    socket.on("privateMessageSeen", handlePrivateMessageSeen);
    socket.on("privateChatOnline", handlePrivateChatOnline);
    socket.on("comment", handleComment);
    socket.on("receivePrivateMessage", handleReceivePrivateMessage);
    socket.on("privateMessageTyping", handlePrivateMessageTyping);

    return () => {
      socket.off("receivePrivateMessage", handleReceivePrivateMessage);
      socket.off("privateMessageTyping", handlePrivateMessageTyping);
      socket.off("comment", handleComment);
      socket.off("privateChatOnline", handlePrivateChatOnline);
      socket.off("privateMessageSeen", handlePrivateMessageSeen);
    };
  }, [
    communityUsers,
    lastMessageId,
    peerConversationId,
    selectedMessageForReply,
    setChatStatus,
    setLastMessageId,
    setLastMessageSeenUser,
    setPrivateChatDetail,
    setTotalOnlineUsers,
    socket,
    userId,
  ]);

  const sendMessage = () => {
    const sendComment = (messageId, comment, type) => {
      socket.emit("comment", { messageId, comment, type }, (res) => {
        console.log("replyRes", res);
      });
    };

    const sendPrivateMessage = (type, message) => {
      socket.emit(
        "sendPrivateMessage",
        {
          receiverUserId: privateChatInfo?.info?.participantDetails?._id,
          communityId: privateChatInfo?.info?.community,
          type,
          message,
        },
        (res) => {
          console.log("sendPrivateMessage", res);
        }
      );
    };

    if (userMessage !== "" && userMessage[0] !== " ") {
      if (selectedMessageForReply) {
        sendComment(selectedMessageForReply?._id, [userMessage], "text");
        setSelectedMessageForReply(null);
      } else {
        sendPrivateMessage("text", [userMessage]);
      }
      setUserMessage("");
    }

    if (files.length > 0) {
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
          sendPrivateMessage(getFileExtension(file), [file])
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

  const writeMessage = (e) => {
    setUserMessage(e.target.value);
  };

  useEffect(() => {
    let delayDebounceFn;

    if (userMessage) {
      delayDebounceFn = setTimeout(() => {
        socket.emit("privateMessageTyping", {
          communityId: privateChatInfo?.info?.community,
          receiverUserId: privateChatInfo?.info?.participantDetails?._id,
        });
      }, 500);
    }

    return () => clearTimeout(delayDebounceFn);
  }, [
    privateChatInfo?.info?.community,
    privateChatInfo?.info?.participantDetails?._id,
    socket,
    userMessage,
  ]);

  return (
    <div>
      <div className="d-flex gap-3 group-detail-header w-100 justify-content-between p-2">
        <div
          className="d-flex gap-3"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <button
            className="group-detail-header-button"
            onClick={() => {
              // leaveRoom({
              // 	communityId: privateChatInfo?.info?.community,
              // 	participantId: privateChatInfo?.info?.participantDetails?._id,
              // });
              setPrivateChatInfo({ info: null, isPrivateChatOpen: false });
              setPeerConversationId("");
            }}
          >
            <IoIosArrowBack color="white" />
          </button>
          <div
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            className="d-flex gap-2 align-items-center"
          >
            <div>
              <div>
                <Avatar
                  alt="group"
                  size="30px"
                  src={privateChatInfo?.info?.participantDetails?.profilePic}
                  initialsFontSize="12px"
                  fullName={
                    privateChatInfo?.info?.participantDetails?.firstName +
                    " " +
                    privateChatInfo?.info?.participantDetails?.lastName
                  }
                />
              </div>
            </div>

            <div
              className="d-flex flex-column"
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <strong
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                  fontSize: isMobileView ? "12px" : "",
                }}
              >
                {privateChatInfo?.info?.participantDetails?.firstName +
                  " " +
                  privateChatInfo?.info?.participantDetails?.lastName}
              </strong>
              <small className="chat-detail-header">
                <ChatStatus chatStatus={chatStatus} />
              </small>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: isMobileView ? "calc(100vh - 220px)" : "calc(100vh - 310px)",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent:
            privateChatDetail && privateChatDetail?.length === 0
              ? "center"
              : "flex-start",
        }}
      >
        <InfiniteScroller
          loadMore={async () => {
            if (isAPICall) return;
            setStartAPICall(true);
            await fetchNextPage();
            setTimeout(() => {
              setStartAPICall(false);
            }, 2000);
          }}
          hasMore={hasNextPage && !isAPICall}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <span ref={scroll}></span>
          {typingUser && (
            <div className="d-flex align-items-center gap-2">
              <Avatar
                size="30px"
                fullName={typingUser?.firstName + " " + typingUser?.lastName}
                src={typingUser?.profilePic}
                alt="typingUser"
                initialsFontSize="10px"
              />
              <TypingIndicator />
            </div>
          )}

          {privateChatDetail &&
            privateChatDetail?.map((message) => {
              return (
                <SingleMessage
                  setSelectedMessageForReply={setSelectedMessageForReply}
                  key={message?._id}
                  message={message}
                  socket={socket}
                  setPrivateChatDetail={setPrivateChatDetail}
                  chatSetting={chatSetting}
                  lastMessageId={lastMessageId}
                  lastMessageSeenUser={lastMessageSeenUser}
                />
              );
            })}

          {privateChatDetail && privateChatDetail?.length === 0 && (
            <div className="w-100 d-flex justify-content-center align-items-center">
              No messages found
            </div>
          )}
        </InfiniteScroller>
      </div>

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
        overAllSetting={{
          canUserSendMessage: true,
        }}
      />
    </div>
  );
};

export default React.memo(PrivateChatDetail);
