import { useIsMobileView } from "../../../hooks/index";
import TimeAgo from "javascript-time-ago";
import React from "react";
import { GoDotFill } from "react-icons/go";

const ChatStatus = ({ chatStatus }) => {
  const timeAgo = new TimeAgo("en-US");
  const { isMobileView } = useIsMobileView({});
  return (
    <div
      style={{
        fontSize: isMobileView ? "10px" : "",
      }}
    >
      {chatStatus?.isOnline ? (
        <span className="d-flex align-items-center">
          <GoDotFill color="#008080" size={isMobileView ? 12 : 16} />
          <span>Online</span>
        </span>
      ) : chatStatus?.lastOnlineAt ? (
        <span>
          last online {timeAgo.format(new Date(chatStatus?.lastOnlineAt))}
        </span>
      ) : (
        <span className="d-flex align-items-center">
          <GoDotFill color="grey" size={16} />
          <span>Offline</span>
        </span>
      )}
    </div>
  );
};

export default ChatStatus;
