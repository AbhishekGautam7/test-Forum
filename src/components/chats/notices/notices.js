import { useEffect, useRef, useState } from "react";

import { Button } from "reactstrap";

import { IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { useGetNotices } from "../hooks/useGetNotices";
import InfiniteScroller from "../modules/infiniteScroller";
import CreateNotice from "./createNotice";
import SingleNotice from "./singleNotice";
import SingleNoticePlaceHolder from "./singleNoticePlaceholder";
import { useIsMobileView } from "../../../hooks/index";

const Notices = ({ socket, communityId, role, chatSetting, activeTab }) => {
  const [isCreateNoticeFormOpen, setIsCreateNoticeFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { isMobileView } = useIsMobileView({});

  const [isAPICall, setStartAPICall] = useState(false);

  const scroll = useRef();

  const {
    notices,
    hasNextPage,
    fetchNextPage,
    isLoading,
    setNotices,
    defaultGroup,
    currentPage,
  } = useGetNotices({ activeTab });

  const userId = useSelector((state) => state.info.userId);

  useEffect(() => {
    if (currentPage === 1) {
      socket.emit("noticeMessageSeen", { communityId: communityId }, (res) => {
        console.log("seen", res);
      });
    }
    // return socket.disconnect();
  }, [communityId, currentPage, socket]);

  useEffect(() => {
    socket.on("comment", (data) => {
      if (chatSetting?.notice?.comment?.canSeeComment) {
        const isOwnMessage = data?.comment?.sender === userId;
        setNotices((prevState) => {
          return prevState.map((item) => {
            if (item?._id === data?.comment?.parentMessage?._id) {
              return {
                ...item,
                comments: [data.comment, ...item.comments],
                totalComments: data?.totalComments,
              };
            } else {
              return item;
            }
          });
        });

        if (!isOwnMessage) {
          socket.emit(
            "noticeMessageSeen",
            { communityId: data?.comment?.community },
            (res) => {
              console.log("seen", res);
            }
          );
          // }
        }
      }
    });
    socket.on("receiveNoticeMessage", (data) => {
      // if (defaultGroup?._id === data?.message?.groupReceiver) {
      const isOwnMessage = data.message.sender === userId;

      const newNotices = {
        ...data.message,
        isOwnMessage,
        comments: [],
        canDelete: isOwnMessage,
      };
      setNotices((prevState) => [newNotices, ...prevState]);
      if (!isOwnMessage) {
        socket.emit(
          "noticeMessageSeen",
          { communityId: communityId },
          (res) => {
            console.log("seen", res);
          }
        );
      }
      // }
    });
    socket.on("messageDeleted", (data) => {
      setNotices((prevState) => {
        return prevState.filter((item) => item._id !== data?.message?._id);
      });
    });

    return () => {
      socket.off("messageDeleted");
      socket.off("receiveNoticeMessage");
      socket.off("comment");
    };
  }, [communityId, defaultGroup?._id, setNotices, socket, userId]);

  const sendMessage = () => {
    if (message !== "") {
      socket.emit(
        "sendNoticeMessage",
        {
          communityId,
          type: "text",
          message: [message],
        },
        (res) => {
          console.log("res", res);
        }
      );

      setMessage("");
      scroll?.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  return (
    <>
      {isCreateNoticeFormOpen ? (
        <CreateNotice
          setIsCreateNoticeFormOpen={setIsCreateNoticeFormOpen}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      ) : (
        <>
          <div
            style={{
              height: isMobileView
                ? "calc(100vh - 220px)"
                : "calc(100vh - 310px)",
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              justifyContent:
                notices && notices.length === 0 ? "center" : "flex-start",
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

              {notices &&
                notices?.map((message) => (
                  <SingleNotice
                    key={message?._id}
                    message={message}
                    socket={socket}
                    setNotices={setNotices}
                    chatSetting={chatSetting}
                    activeTab={activeTab}
                    defaultGroup={defaultGroup}
                    notices={notices}
                  />
                ))}
              {notices && notices?.length === 0 && (
                <div className="w-100 d-flex justify-content-center align-items-center">
                  No notices found
                </div>
              )}
              {isLoading && (
                <div className="w-100">
                  {[1, 2].map((item) => (
                    <SingleNoticePlaceHolder key={item} />
                  ))}
                </div>
              )}
            </InfiniteScroller>
          </div>

          {chatSetting?.notice?.canUserSendNotice && (
            <div className="p-2 tab-footer">
              <Button
                color="primary"
                className="w-100"
                onClick={() => setIsCreateNoticeFormOpen(true)}
              >
                <strong>Publish new notice</strong>
                <IoIosArrowForward />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Notices;
