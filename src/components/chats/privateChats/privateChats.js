import TimeAgo from "javascript-time-ago";
import { useEffect, useState } from "react";
import { MdOutlinePermMedia } from "react-icons/md";
import { useSelector } from "react-redux";
import { allowedFileTypesInChat } from "../../../constants/constants";
import { getFileExtension } from "../../../libary/extractExtensionFromUrl";
import { Avatar, Search } from "../../modules";
import { useGetCommunityMembersForPrivateChat } from "../hooks/useGetCommunityMembersForPrivateChat";
import { useGetPrivateChats } from "../hooks/useGetPrivateChats";
import InfiniteScroller from "../modules/infiniteScroller";
import { MemberBox } from "./memberBox";
import { useIsMobileView } from "../../../hooks/index";

const PrivateChats = ({
  socket,
  setPrivateChatInfo,
  activeTab,
  privateChats,
  setPrivateChats,
  unseenMessageCount,
}) => {
  const { fetchNextPage, hasNextPage, isLoading } = useGetPrivateChats({
    activeTab,
    setPrivateChats,
  });

  const { isMobileView } = useIsMobileView({});

  const communityId = useSelector((state) => state.info.communityId);
  const {
    isLoading: isLoadingMembers,
    setSearch,
    userList,
  } = useGetCommunityMembersForPrivateChat();

  const [isAPICall, setStartAPICall] = useState(false);

  const timeAgo = new TimeAgo("en-US");

  useEffect(() => {
    if (activeTab !== "chats") {
      setSearch("");
    }
  }, [activeTab, setSearch]);

  // useEffect(() => {
  // 	if (unseenMessageCount && unseenMessageCount?.peerWiseCount?.length > 0) {
  // 		setPrivateChats((prevState) => {
  // 			if (unseenMessageCount?.peerWiseCount?.length > 0 && prevState) {
  // 				return prevState.map((group) => {
  // 					const foundGroup = unseenMessageCount?.peerWiseCount?.find(
  // 						(g) => g._id === group._id
  // 					);
  // 					return {
  // 						...group,
  // 						unreadMessageCounts: foundGroup?.count,
  // 					};
  // 				});
  // 			}
  // 		});
  // 	}
  // }, [setPrivateChats, unseenMessageCount]);

  useEffect(() => {
    const handleComment = (data) => {
      const privateChatsCopy = [...privateChats];

      const matchedIndex = privateChatsCopy.findIndex(
        (state) => state._id === data?.comment?.peerConversation
      );

      if (matchedIndex > -1) {
        const matchedState = privateChatsCopy.splice(matchedIndex, 1)[0];

        privateChatsCopy.unshift({
          ...matchedState,
          lastMessage: data?.comment,
          unreadMessageCounts: data?.comment?.unseenMessageCounts,
        });
      }

      setPrivateChats(privateChatsCopy);
    };

    const handleReceivePrivateMessage = (data) => {
      const privateChatsCopy = [...privateChats];

      const matchedIndex = privateChatsCopy.findIndex(
        (state) => state._id === data?.message?.peerConversation
      );

      if (matchedIndex > -1) {
        const matchedState = privateChatsCopy.splice(matchedIndex, 1)[0];

        privateChatsCopy.unshift({
          ...matchedState,
          lastMessage: data?.message,
          unreadMessageCounts: data?.message?.unseenMessageCounts,
        });
      } else {
        privateChatsCopy.unshift({
          _id: data?.message?.peerConversation,
          community: data?.message?.community,
          lastMessage: data?.message,
          participant: data?.message?.sender,
          participantDetails: data?.message?.senderDetails,
          unreadMessageCounts: 1,
        });
      }

      setPrivateChats(privateChatsCopy);
    };

    socket.on("comment", handleComment);
    socket.on("receivePrivateMessage", handleReceivePrivateMessage);

    return () => {
      socket.off("receivePrivateMessage", handleReceivePrivateMessage);
      socket.off("comment", handleComment);
    };
  }, [
    privateChats,
    setPrivateChats,
    socket,
    unseenMessageCount?.peerWiseCount,
  ]);

  const joinRoom = ({ participantId, communityId }) => {
    console.log("participamt", participantId, communityId);
    socket
      .compress(false)
      .emit(
        "enterPrivateChat",
        { otherParticipantId: participantId, communityId },
        (res) => {
          console.log("joinedPrivateChat", res);
        }
      );
  };

  return (
    <div className="white-bg">
      <div>
        <Search setSearch={setSearch} activeTab={activeTab} />
        <div
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <div
            className="position-absolute white-bg"
            style={{
              maxHeight: "60vh",
              height: userList && userList.length === 0 ? "40vh" : "auto",
              overflowY: "auto",
              borderRadius: "6px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              background: "white",
              zIndex: "999",
              justifyContent:
                userList && userList.length === 0 ? "center" : "flex-start",
              alignItems:
                userList && userList.length === 0 ? "center" : "flex-start",
            }}
          >
            {isLoadingMembers && (
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                style={{
                  height: "400px",
                }}
              >
                Loading members...
              </div>
            )}
            {userList &&
              userList?.length > 0 &&
              userList.map((member) => (
                <div
                  key={member?._id}
                  style={{
                    width: "100%",
                  }}
                  onClick={() => {
                    setPrivateChatInfo({
                      info: {
                        participantDetails: member,
                        community: communityId,
                      },
                      isPrivateChatOpen: true,
                    });
                    if (communityId) {
                      joinRoom({
                        communityId,
                        participantId: member?._id,
                      });
                    }
                  }}
                >
                  <MemberBox member={member} />
                </div>
              ))}
            {userList && userList?.length === 0 && (
              <div className="w-100 d-flex justify-content-center align-items-center">
                No members found
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            height: isMobileView
              ? "calc(100vh - 220px)"
              : "calc(100vh - 310px)",
            overflowY: "auto",
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
          >
            {privateChats && privateChats?.length === 0 && (
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                style={{
                  height: "400px",
                }}
              >
                No chats to display
              </div>
            )}
            {isLoading ? (
              <div
                className="w-100 d-flex justify-content-center align-items-center"
                style={{
                  height: "400px",
                }}
              >
                Loading chats...
              </div>
            ) : (
              <>
                {privateChats &&
                  privateChats?.length > 0 &&
                  privateChats.map((chat) => (
                    <div
                      key={chat?._id}
                      className="group-chat-item"
                      onClick={() => {
                        setPrivateChatInfo({
                          info: chat,
                          isPrivateChatOpen: true,
                        });
                        // joinRoom({
                        // 	communityId: chat.community,
                        // 	participantId: chat?.participant,
                        // });
                      }}
                    >
                      <Avatar
                        alt={chat?.participantDetails?.firstName}
                        fullName={
                          chat?.participantDetails?.firstName +
                          " " +
                          chat?.participantDetails?.lastName
                        }
                        src={chat?.participantDetails?.profilePic}
                        size="3rem"
                        initialsFontSize="16px"
                      />

                      <div
                        className="group-chat-content-wrapper"
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <div className="group-chat-header">
                          <div
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              textTransform: "capitalize",
                            }}
                            className="group-chat-title"
                          >
                            <strong style={{ fontSize: "1rem" }}>
                              {chat?.participantDetails?.firstName +
                                " " +
                                chat?.participantDetails?.lastName}
                            </strong>
                          </div>
                          <div className="group-chat-time">
                            {chat?.lastMessage?.createdAt
                              ? timeAgo.format(
                                  new Date(chat?.lastMessage?.createdAt)
                                )
                              : null}
                          </div>
                        </div>
                        <div className="group-chat-last-message-wrapper">
                          <div
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              fontSize: "0.875rem",
                              fontWeight: chat?.lastMessage?.hasSeen
                                ? "400"
                                : "600",
                              color: chat?.lastMessage?.hasSeen
                                ? "grey"
                                : "black",
                            }}
                          >
                            {chat?.lastMessage?.content[0] ? (
                              allowedFileTypesInChat.includes(
                                getFileExtension(chat?.lastMessage?.content[0])
                              ) ? (
                                <small className="d-flex align-items-center gap-2 text-muted">
                                  <MdOutlinePermMedia />
                                  <span>Media Files</span>
                                </small>
                              ) : (
                                <small>{chat?.lastMessage?.content[0]}</small>
                              )
                            ) : (
                              "No new message"
                            )}
                          </div>
                          {chat?.unreadMessageCounts > 0 && (
                            <div>
                              <small className="unread-message-count">
                                {chat?.unreadMessageCounts}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </InfiniteScroller>
        </div>
      </div>
    </div>
  );
};

export default PrivateChats;
