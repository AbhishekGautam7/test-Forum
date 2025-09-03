import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { Search } from "../../modules";
import { useGetCommunityGroupList } from "../hooks";

import TimeAgo from "javascript-time-ago";
import { MdOutlinePermMedia } from "react-icons/md";
import { allowedFileTypesInChat } from "../../../constants/constants";
import { getFileExtension } from "../../../libary/extractExtensionFromUrl";
import InfiniteScroller from "../modules/infiniteScroller";
import GroupImage from "./groupImage";

const GroupChats = ({
  setIsCreateGroupFormOpen,
  setIsGroupDetailBoxOpen,
  setGroupInfo,
  socket,
  activeTab,
  chatSetting,
  communityGroupList,
  setCommunityGroupList,
  unseenMessageCount,
}) => {
  const communityId = useSelector((state) => state.info.communityId);

  const timeAgo = new TimeAgo("en-US");

  const [isAPICall, setStartAPICall] = useState(false);

  const { fetchNextPage, hasNextPage, isLoading, setSearch } =
    useGetCommunityGroupList({ communityId, activeTab, setCommunityGroupList });

  const handleButtonClick = () => {
    setGroupInfo(false);
    setIsCreateGroupFormOpen(true);
  };

  // useEffect(() => {
  // 	if (unseenMessageCount && unseenMessageCount?.groupWiseCount?.length > 0) {
  // 		setCommunityGroupList((prevState) => {
  // 			if (unseenMessageCount?.groupWiseCount?.length > 0 && prevState) {
  // 				return prevState.map((group) => {
  // 					const foundGroup = unseenMessageCount?.groupWiseCount?.find(
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
  // }, [setCommunityGroupList, unseenMessageCount]);

  useEffect(() => {
    const handleComment = (data) => {
      const communityGroupListCopy = [...communityGroupList];

      const matchedIndex = communityGroupListCopy.findIndex(
        (state) => state._id === data?.comment?.groupReceiver
      );

      if (matchedIndex > -1) {
        const matchedState = communityGroupListCopy.splice(matchedIndex, 1)[0];

        communityGroupListCopy.unshift({
          ...matchedState,
          lastMessage: data?.comment,
          unreadMessageCounts: data?.comment?.unseenMessageCounts,
        });
      }

      setCommunityGroupList(communityGroupListCopy);
    };
    const handleReceiveGroupMessage = (data) => {
      const communityGroupListCopy = [...communityGroupList];

      const matchedIndex = communityGroupListCopy.findIndex(
        (state) => state._id === data?.message?.groupReceiver
      );

      if (matchedIndex > -1) {
        const matchedState = communityGroupListCopy.splice(matchedIndex, 1)[0];
        communityGroupListCopy.unshift({
          ...matchedState,
          lastMessage: data?.message,
          unreadMessageCounts: data?.message?.unseenMessageCounts,
        });
      } else {
        communityGroupListCopy.unshift({
          _id: data?.message?.groupReceiver,
          community: data?.message?.community,
          lastMessage: data?.message,
          participantDetails: data?.message?.senderDetails,
          name: data?.message?.groupDetails?.name,
          users: data?.message?.groupDetails?.users,
          unreadMessageCounts: 1,
        });
      }

      setCommunityGroupList(communityGroupListCopy);
    };

    socket.on("comment", handleComment);
    socket.on("receiveGroupMessage", handleReceiveGroupMessage);

    return () => {
      socket.off("receiveGroupMessage", handleReceiveGroupMessage);
      socket.off("comment", handleComment);
    };
  }, [communityGroupList, setCommunityGroupList, socket]);

  // const joinRoom = ({ groupId, communityId }) => {
  // 	socket
  // 		.compress(false)
  // 		.emit("enterGroup", { groupId, communityId }, (res) => {
  // 			console.log("joined", res);
  // 		});
  // };

  return (
    <div className="white-bg">
      <Search setSearch={setSearch} />

      <div
        style={{
          height: "calc(100vh - 240px)",
          overflow: "auto",
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
          {communityGroupList &&
            communityGroupList?.length > 0 &&
            communityGroupList.map((group) => (
              <div
                key={group?._id}
                className="group-chat-item"
                onClick={() => {
                  // joinRoom({ communityId, groupId: group?._id });
                  setIsGroupDetailBoxOpen(true);
                  setIsCreateGroupFormOpen(false);
                  setGroupInfo({
                    id: group?._id,
                    name: group?.name,
                    users: group?.users,
                    communityId: group?.community,
                  });
                }}
              >
                <GroupImage users={group?.users} />
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
                        fontSize: "1rem",
                      }}
                      className="group-chat-title text-capitalize"
                    >
                      {group?.name}
                    </div>
                    <div className="group-chat-time">
                      {group?.lastMessage?.createdAt
                        ? timeAgo.format(
                            new Date(group?.lastMessage?.createdAt)
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
                        fontWeight: group?.lastMessage?.hasSeen ? "400" : "600",
                        color: group?.lastMessage?.hasSeen ? "grey" : "black",
                      }}
                    >
                      {group?.lastMessage?.content[0] ? (
                        allowedFileTypesInChat.includes(
                          getFileExtension(group?.lastMessage?.content[0])
                        ) ? (
                          <small className="d-flex align-items-center gap-2 text-muted">
                            <MdOutlinePermMedia />
                            <span>Media Files</span>
                          </small>
                        ) : (
                          <small>{group?.lastMessage?.content[0]}</small>
                        )
                      ) : (
                        <small>No new message</small>
                      )}
                    </div>
                    {group?.unreadMessageCounts > 0 && (
                      <div>
                        <small className="unread-message-count">
                          {group?.unreadMessageCounts}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {communityGroupList && communityGroupList?.length === 0 && (
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{
                height: "400px",
              }}
            >
              No groups found
            </div>
          )}
          {isLoading && (
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{
                height: "400px",
              }}
            >
              Loading groups...
            </div>
          )}
        </InfiniteScroller>
      </div>

      {chatSetting?.groupChat?.canCreateGroup && (
        <div className="tab-footer">
          <Button color="primary w-100" onClick={handleButtonClick}>
            <strong>Create New Group</strong>
            <IoIosArrowForward />
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupChats;
