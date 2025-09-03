import Avatar from "../../../modules/Avatar";
import TypingIndicator from "../../../modules/TypingIndicator";
import React, { useEffect, useRef, useState } from "react";
import GroupMessage from "../groupMessage";
import InfiniteScroller from "../../../chats/modules/infiniteScroller";
import { useIsMobileView } from "../../../../hooks/index";

const GroupDetailBody = ({
  hasNextPage,
  fetchNextPage,
  scroll,
  typingUser,
  groupMessages,
  setGroupMessages,
  setSelectedMessageForReply,
  socket,
  overAllSetting,
  isLoading,
  lastMessageSeenUsers,
  lastMessageId,
}) => {
  const [isAPICall, setStartAPICall] = useState(false);
  const containerRef = useRef(null);
  const messagesRef = useRef([]);
  const { isMobileView } = useIsMobileView({});

  // useEffect(() => {
  // 	const checkVisibility = () => {
  // 		const container = containerRef.current;
  // 		const messages = messagesRef.current;
  // 		const lastMessage = messages[lastMessageId];

  // 		console.log("lastMessage", lastMessage);

  // 		if (container && lastMessage) {
  // 			const containerRect = container.getBoundingClientRect();
  // 			const messageRect = lastMessage.getBoundingClientRect();

  // 			const isElementVisible =
  // 				messageRect.top >= containerRect.top &&
  // 				messageRect.left >= containerRect.left &&
  // 				messageRect.bottom <= containerRect.bottom &&
  // 				messageRect.right <= containerRect.right;

  // 			setIsVisible(isElementVisible);
  // 		}
  // 	};

  // 	const handleVisibilityChange = () => {
  // 		if (document.visibilityState === "visible") {
  // 			// Browser is active
  // 			// You can perform actions when the browser becomes active
  // 			console.log("Browser is active");
  // 		}
  // 	};

  // 	// Initial check
  // 	checkVisibility();

  // 	// Event listeners
  // 	document.addEventListener("visibilitychange", handleVisibilityChange);
  // 	window.addEventListener("scroll", checkVisibility);

  // 	// Clean up
  // 	return () => {
  // 		document.removeEventListener("visibilitychange", handleVisibilityChange);
  // 		window.removeEventListener("scroll", checkVisibility);
  // 	};
  // }, [lastMessageId]);

  return (
    <div
      style={{
        height: isMobileView ? "calc(100vh - 220px)" : "calc(100vh - 310px)",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent:
          groupMessages && groupMessages?.length === 0
            ? "center"
            : "flex-start",
      }}
      ref={containerRef}
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

        {groupMessages && groupMessages?.length === 0 && (
          <div className="w-100 d-flex justify-content-center align-items-center">
            No messages found
          </div>
        )}

        {groupMessages?.map((message) => {
          return (
            <GroupMessage
              setSelectedMessageForReply={setSelectedMessageForReply}
              key={message?._id}
              message={message}
              socket={socket}
              setGroupMessages={setGroupMessages}
              overAllSetting={overAllSetting}
              lastMessageSeenUsers={lastMessageSeenUsers}
              lastMessageId={lastMessageId}
              containerRef={containerRef}
              messagesRef={messagesRef}
            />
          );
        })}
      </InfiniteScroller>
    </div>
  );
};

export default React.memo(GroupDetailBody);
