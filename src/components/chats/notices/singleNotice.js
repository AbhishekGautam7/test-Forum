import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "../../modules";

import TimeAgo from "javascript-time-ago";
import { AiFillLike } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { MdComment } from "react-icons/md";
import { useSelector } from "react-redux";
import { Button, Input } from "reactstrap";

import { MdOutlineDeleteOutline } from "react-icons/md";
import { useGetNoticeComments } from "../hooks/useGetNoticeComments";
import CommentBox from "./commentBox";
import useChatStore from "../../../stores/chatStore";

const SingleNotice = ({
  message,
  socket,
  setNotices,
  chatSetting,
  defaultGroup,
  activeTab,
  notices,
}) => {
  const [show, setShow] = useState(false);

  const [comment, setComment] = useState("");

  const [showAlert, setShowAlert] = useState();

  const [selectedNotice, setSelectedNotice] = useState("");

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    noticeComments,
    totalComments,
  } = useGetNoticeComments({
    messageId: message?._id,
    showComment: show,
    activeTab,
    selectedNotice,
  });

  const { setHasClickedOnInputBox } = useChatStore((store) => store);

  const timeAgo = new TimeAgo("en-US");
  const communityUsers = useSelector(
    (state) => state.currentCommunity.data.communityUsers
  );
  const popupRef = useRef(null);

  const [showReadMore, setShowReadMore] = useState(true);

  const [descClass, setDescClass] = useState("");

  const noticeRef = useRef();

  const [isMaxHeight, setIsMaxHeight] = useState(false);

  useEffect(() => {
    if (noticeRef.current) {
      if (noticeRef.current.clientHeight > 400) {
        setIsMaxHeight(true);
      } else {
        setIsMaxHeight(false);
      }
    }
  }, []);

  useEffect(() => {
    socket.on("reaction", (data) => {
      console.log("resReact", data);
      setNotices((prevState) => {
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
    return () => {
      socket.off("reaction");
    };
  }, [setNotices, socket]);

  useEffect(() => {
    const updateImageStyle = () => {
      const imgTags = noticeRef.current.querySelectorAll("img");
      imgTags.forEach((img) => {
        img.style.width = "100%";
        img.style.height = "100%";
      });
    };

    updateImageStyle();
  }, [message]);

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

  const sendComment = () => {
    if (comment !== "" && comment !== " ") {
      socket.emit(
        "comment",
        {
          messageId: message?._id,
          comment: [comment],
          type: "text",
        },
        (res) => {
          console.log("res", res);
        }
      );

      setComment("");
    }
    setHasClickedOnInputBox(false);
  };

  const deleteNotice = () => {
    socket.emit("deleteMessage", { messageId: message?._id }, (res) => {
      console.log("deletedNotice", res);
    });
  };

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

    setNotices((prevState) => {
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

  const writeComment = (e) => {
    setComment(e.target.value);
  };

  // if (isLoading || isFetching) {
  // 	return <SingleNoticePlaceHolder />;
  // }

  const expandDescription = () => {
    setShowReadMore(false);
    setDescClass("expand");
  };
  const collapseDescription = () => {
    setShowReadMore(true);
    setDescClass("");
  };

  return (
    <div
      style={{
        padding: "0.5rem",
        position: "relative",
      }}
    >
      {showAlert && (
        <div
          style={{
            position: "absolute",
            right: "5%",
            top: 0,
            background: "white",
            transform: "translate(0, 10px)",
            padding: "1rem 0.75rem",
            boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.26)",
            borderRadius: "5px",
            zIndex: 999,
          }}
          ref={popupRef}
        >
          <h6 className="mb-4">Are you sure you want to delete this notice?</h6>
          <div className="w-100 d-flex justify-content-end gap-2">
            <Button
              color="danger"
              onClick={(e) => {
                e.stopPropagation();
                deleteNotice();
              }}
            >
              Yes
            </Button>
            <Button outline color="danger" onClick={() => setShowAlert(false)}>
              No
            </Button>
          </div>
        </div>
      )}
      <div className="single-notice-container  mb-3">
        <div className="px-3 py-2 d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center justify-content-between gap-2 w-100">
            <div className="d-flex align-items-center gap-2 ">
              <Avatar
                src={message?.senderDetails?.profilePic}
                size="30px"
                alt="profile"
                initialsFontSize="14px"
                fullName={
                  message?.senderDetails?.firstName +
                  " " +
                  message?.senderDetails?.lastName
                }
              />
              <strong
                className="custom-black text-capitalize"
                style={{
                  fontSize: "0.9rem",
                }}
              >
                {message?.senderDetails?.firstName +
                  " " +
                  message?.senderDetails?.lastName}
              </strong>
              <small className="text-muted">
                {timeAgo.format(new Date(message?.createdAt))}
              </small>
            </div>
            {message?.canDelete && (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setShowAlert((prevState) => !prevState)}
              >
                <MdOutlineDeleteOutline />
              </div>
            )}
          </div>
        </div>
        <p
          className={`descWrapper  ${descClass} ${isMaxHeight ? "max" : ""}`}
          style={{
            // minHeight: "10rem",
            fontSize: "0.9rem",
            wordBreak: "break-all",
            padding: "0.5rem 1rem",
          }}
        >
          <div
            ref={noticeRef}
            dangerouslySetInnerHTML={{
              __html: message?.content[0],
            }}
          />
        </p>

        {isMaxHeight && showReadMore && (
          <button className="readmore linkBtn" onClick={expandDescription}>
            View more
          </button>
        )}
        {isMaxHeight && !showReadMore && (
          <button className="readmore linkBtn" onClick={collapseDescription}>
            View less
          </button>
        )}

        {(chatSetting?.notice?.comment?.isEnabled ||
          chatSetting?.notice?.reaction?.isEnabled) && (
          <div
            style={{
              border: "1px solid #ededed",
            }}
            className="button-group"
          >
            {chatSetting?.notice?.reaction?.isEnabled && (
              <Button
                outline={message?.hasUserReacted ? false : true}
                className="w-100 rounded-pill "
                color="success"
                onClick={reactToMessage}
                size="sm"
              >
                <AiFillLike className="me-1" />
                {chatSetting?.notice?.reaction?.canSeeReaction && (
                  <span>{message?.totalReaction}</span>
                )}
              </Button>
            )}

            {chatSetting?.notice?.comment?.isEnabled && (
              <Button
                outline
                className="w-100 rounded-pill"
                size="sm"
                color="primary"
              >
                <MdComment className="me-1" />
                <span>
                  {selectedNotice ? totalComments : message?.totalComments}
                </span>
              </Button>
            )}
          </div>
        )}

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {selectedNotice
            ? noticeComments?.length > 0 &&
              noticeComments?.map((comment) => (
                <CommentBox
                  comment={comment}
                  communityUsers={communityUsers}
                  key={comment?._id}
                />
              ))
            : message?.comments?.length > 0 &&
              message?.comments?.map((comment) => (
                <CommentBox
                  comment={comment}
                  communityUsers={communityUsers}
                  key={comment?._id}
                />
              ))}
        </div>

        {chatSetting?.notice?.comment?.isEnabled && (
          <div
            className="w-100 d-flex gap-2"
            style={{
              border: "1px solid #ededed",
              padding: "0.5rem 0.75rem",
            }}
          >
            <Input
              placeholder="Write your comment"
              value={comment}
              onChange={writeComment}
              onClick={() => {
                setSelectedNotice("");
                setHasClickedOnInputBox(true);
              }}
              onBlur={() => {
                if (!comment) {
                  setHasClickedOnInputBox(false);
                }
              }}
              onKeyPress={(e) => {
                e.key === "Enter" && sendComment();
              }}
            />
            <Button color="primary" onClick={sendComment}>
              <IoIosArrowForward />
            </Button>
          </div>
        )}

        {!selectedNotice && message?.comments?.length > 2 && (
          <div className="w-/100 px-2 py-2">
            <Button
              outline
              className="w-100 "
              onClick={() => {
                setSelectedNotice(message?._id);
              }}
            >
              <strong>{isFetching ? "Loading..." : "See more"}</strong>
            </Button>
          </div>
        )}

        {hasNextPage && selectedNotice && (
          <div className="w-/100 px-2 py-2">
            <Button
              outline
              className="w-100 "
              onClick={() => {
                fetchNextPage();
                setShow((prevState) => !prevState);
              }}
            >
              <strong>{isFetching ? "Loading..." : "See more"}</strong>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SingleNotice);
