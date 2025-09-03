import { useEffect } from "react";

import { Avatar } from "../../modules";

import { MdOutlinePermMedia } from "react-icons/md";

import { getFileExtension } from "../../../libary/extractExtensionFromUrl";

import { useIsMobileView } from "../../../hooks/index";
import TimeAgo from "javascript-time-ago";
import { BsReply } from "react-icons/bs";
import { SlDislike, SlLike } from "react-icons/sl";
import { allowedFileTypesInChat } from "../../../constants";
import GroupMessageBlock from "../groupChats/groupMessageBlock";
import ChatReaction from "../modules/chatReaction";
import { IoCloudDownloadOutline } from "react-icons/io5";

const SingleMessage = ({
  message,
  setSelectedMessageForReply,
  socket,
  setPrivateChatDetail,
  chatSetting,
  lastMessageId,
  lastMessageSeenUser,
}) => {
  const timeAgo = new TimeAgo("en-US");

  const { isMobileView } = useIsMobileView({});

  useEffect(() => {
    socket.on("reaction", (data) => {
      setPrivateChatDetail((prevState) => {
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
  }, [message?._id, setPrivateChatDetail, socket]);

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

    setPrivateChatDetail((prevState) => {
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
      className="d-flex gap-3  "
      style={{
        margin: "0.7rem 0",
        justifyContent: message?.isOwnMessage ? "flex-end" : "flex-start",
        padding: message?.isOwnMessage ? "0 1rem 0 0" : "",
      }}
    >
      <Avatar
        alt="group"
        src={message?.senderDetails?.profilePic}
        size="30px"
        fullName={
          message?.senderDetails?.firstName +
          " " +
          message?.senderDetails?.lastName
        }
        initialsFontSize="14px"
        showToolTip={true}
      />

      <div className="group-msg-container-wrapper">
        <div
          className={`group-msg-container  ${
            message?.isOwnMessage ? "own-msg" : "other-msg"
          }`}
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
                      style={{ fontSize: "0.9rem" }}
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
                        <MdOutlinePermMedia /> <span>Media Files</span>
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

              <div className="d-flex flex-column gap-3">
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

            {!message?.isComment && (
              <ul
                className="popover"
                style={{
                  top: "-10px",
                  //   right: message?.isOwnMessage ? "auto" : "-50px",
                  //   left: message?.isOwnMessage ? "-50px" : "auto",
                }}
              >
                {chatSetting?.privateChat?.comment?.isEnabled && (
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
                {chatSetting?.privateChat?.reaction?.isEnabled && (
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
                        <a href={message?.content[0]} download>
                          Download
                        </a>
                      </small>
                    </li>
                  )}
              </ul>
            )}
          </div>
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
        </div>
        {message?.totalReaction > 0 && <ChatReaction message={message} />}
        <div className="d-flex w-100 justify-content-end ">
          {message?._id === lastMessageId && lastMessageSeenUser && (
            <Avatar
              alt="group"
              key={lastMessageSeenUser?._id}
              src={lastMessageSeenUser?.profilePic}
              size="14px"
              fullName={
                lastMessageSeenUser?.firstName +
                " " +
                lastMessageSeenUser?.lastName
              }
              initialsFontSize="7px"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
