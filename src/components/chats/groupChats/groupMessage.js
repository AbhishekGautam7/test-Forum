import { useEffect, useRef, useState } from "react";

import { Avatar } from "../../modules";

import { MdOutlinePermMedia } from "react-icons/md";

import { getFileExtension } from "../../../libary/extractExtensionFromUrl";

import { useIsMobileView } from "../../../hooks/index";
import TimeAgo from "javascript-time-ago";
import { BsReply } from "react-icons/bs";
import { SlDislike, SlLike } from "react-icons/sl";
import { allowedFileTypesInChat } from "../../../constants";
import ChatReaction from "../modules/chatReaction";
import GroupMessageBlock from "./groupMessageBlock";
import { IoCloudDownloadOutline } from "react-icons/io5";

import Modal from "react-modal";
import { MemberBox } from "../privateChats/memberBox";

const GroupMessage = ({
  message,
  setSelectedMessageForReply,
  socket,
  setGroupMessages,
  overAllSetting,
  lastMessageId,
  lastMessageSeenUsers,
  containerRef,
  messagesRef,
}) => {
  const timeAgo = new TimeAgo("en-US");

  const isSystemMessage = message?.sender === "System";

  const [showAlert, setShowAlert] = useState(false);

  const { isMobileView } = useIsMobileView({});

  const popupRef = useRef(null);

  useEffect(() => {
    socket.on("reaction", (data) => {
      setGroupMessages((prevState) => {
        return prevState.map((item) => {
          if (item?._id === data?.messageId) {
            return {
              ...item,
              totalReaction: data?.totalReaction,
            };
          } else {
            return item;
          }
        });
      });
    });
    return () => socket.off("reaction");
  }, [message?._id, setGroupMessages, socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAlert(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const reactToMessage = () => {
    socket.emit(
      "reaction",
      {
        messageId: message?._id,
      },
      (res) => {
        console.log("reactionRes", res);
      }
    );

    setGroupMessages((prevState) => {
      return prevState.map((item) => {
        if (item?._id === message?._id) {
          return {
            ...item,
            hasUserReacted: !item?.hasUserReacted,
            totalReaction: item?.hasUserReacted
              ? item?.totalReaction - 1
              : item?.totalReaction
              ? item?.totalReaction + 1
              : 1,
          };
        } else {
          return item;
        }
      });
    });
  };

  return (
    <div
      style={{
        padding: "0.5rem",
        position: "relative",
      }}
    >
      <div
        className="d-flex gap-3  "
        style={{
          margin: "0.7rem 0",
          justifyContent: isSystemMessage
            ? "center"
            : message?.isOwnMessage
            ? "flex-end"
            : "flex-start",
          padding: message?.isOwnMessage ? "0 1rem 0 0" : "",
        }}
        ref={(el) => (messagesRef.current[message?._id] = el)}
      >
        {!isSystemMessage && (
          <Avatar
            alt="group"
            src={message?.senderDetails?.profilePic}
            size="30px"
            fullName={
              message?.senderDetails?.firstName +
              " " +
              message?.senderDetails?.lastName
            }
            showToolTip={true}
            initialsFontSize="14px"
          />
        )}

        <div className="group-msg-container-wrapper">
          <div
            className={`${
              isSystemMessage ? "group-system-msg" : "group-msg-container "
            } ${message?.isOwnMessage ? "own-msg" : "other-msg"}`}
          >
            <div className="d-flex justify-content-between align-items-center position-relative">
              <div className="w-100">
                {message?.isComment && (
                  <div
                    className="replied-message w-100 mb-2"
                    style={{
                      display: allowedFileTypesInChat.includes(
                        getFileExtension(message?.parentMessage?.content[0])
                      )
                        ? "flex"
                        : "block",
                      justifyContent: "space-between",
                      gap: "1rem",
                      boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <div>
                      <strong
                        style={{ fontSize: "0.8rem" }}
                        className="text-capitalize"
                      >
                        {message?.parentMessage?.senderDetails?.firstName +
                          " " +
                          message?.parentMessage?.senderDetails?.lastName}
                      </strong>

                      {allowedFileTypesInChat.includes(
                        getFileExtension(message?.parentMessage?.content[0])
                      ) && (
                        <p
                          style={{
                            fontSize: "0.875rem",
                            lineHeight: "1.225rem",
                            letterSpacing: "0.00875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <MdOutlinePermMedia /> <small>Media Files</small>
                        </p>
                      )}
                    </div>
                    {message?.parentMessage &&
                      message?.parentMessage?.content && (
                        <div className="d-flex flex-row flex-wrap gap-1 ">
                          {message?.parentMessage?.content
                            ?.slice(0, 2)
                            ?.map((url, index) => (
                              <GroupMessageBlock
                                key={index}
                                url={url}
                                height="3rem"
                                width="3rem"
                                iconSize={20}
                                docPadding="1rem"
                                isMessage={false}
                              />
                            ))}
                        </div>
                      )}
                  </div>
                )}

                <div className="d-flex flex-column gap-1">
                  {message?.content?.map((url, index) => (
                    <GroupMessageBlock
                      key={index}
                      url={url}
                      height="10rem"
                      width="15rem"
                      docPadding="3rem"
                      iconSize={80}
                      isMessage={true}
                    />
                  ))}
                </div>
              </div>

              {!message?.isComment &&
                !isSystemMessage &&
                overAllSetting &&
                (overAllSetting?.allowComment ||
                  overAllSetting?.allowReaction) && (
                  <ul
                    className="popover"
                    style={{
                      top: "-10px",
                      // right: message?.isOwnMessage ? "auto" : "-50px",
                      // left: message?.isOwnMessage ? "-50px" : "auto",
                    }}
                  >
                    {overAllSetting?.allowComment && (
                      <li
                        style={{
                          padding: "0.4rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                        onClick={() => {
                          setSelectedMessageForReply(message);
                        }}
                      >
                        <BsReply />
                        <small>Reply</small>
                      </li>
                    )}
                    {overAllSetting?.allowReaction && (
                      <li
                        style={{
                          padding: "0.4rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                        onClick={reactToMessage}
                      >
                        {message?.hasUserReacted ? (
                          <>
                            <SlDislike size={10} />
                            <small>Unlike</small>
                          </>
                        ) : (
                          <>
                            <SlLike size={10} />
                            <small>Like</small>
                          </>
                        )}
                      </li>
                    )}
                    {allowedFileTypesInChat.includes(
                      getFileExtension(message?.content[0])
                    ) &&
                      !isMobileView && (
                        <li
                          style={{
                            padding: "0.4rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                          }}
                        >
                          <IoCloudDownloadOutline size={10} />
                          <small>
                            <a href={message?.content[0]}>Download</a>
                          </small>
                        </li>
                      )}
                  </ul>
                )}
            </div>
            {!isSystemMessage && (
              <div className="d-flex mt-2 align-items-center justify-content-between w-full gap-2">
                {allowedFileTypesInChat.includes(
                  getFileExtension(message?.content[0])
                ) &&
                  isMobileView && (
                    <small
                      style={{
                        fontSize: "0.6rem",
                      }}
                    >
                      <a href={message?.content[0]} download>
                        Download
                      </a>
                    </small>
                  )}
                <small
                  style={{
                    color: "#5D5C5D",
                    fontSize: "0.6rem",
                    lineHeight: "0.75rem",
                  }}
                >
                  {timeAgo.format(new Date(message?.createdAt))}
                </small>
              </div>
            )}
          </div>
          {message?.totalReaction > 0 && <ChatReaction message={message} />}
          <div className="d-flex w-100 justify-content-end ">
            {message?._id === lastMessageId &&
              lastMessageSeenUsers &&
              !isSystemMessage &&
              lastMessageSeenUsers?.map((user) => (
                <div className="msg-seen-user">
                  <Avatar
                    alt="group"
                    key={user?._id}
                    src={user?.profilePic}
                    size="14px"
                    fullName={user?.firstName + " " + user?.lastName}
                    initialsFontSize="7px"
                  />
                  <div className="msg-seen-users" ref={popupRef}>
                    {lastMessageSeenUsers &&
                      lastMessageSeenUsers
                        ?.map((user) => `${user.firstName} ${user.lastName}`)
                        .join(", ")}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMessage;
