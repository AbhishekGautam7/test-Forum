import React, { useEffect, useState } from "react";
import {
  editComment,
  deleteComment,
  getReplyList,
  getUsersDetail,
  toogleLikeComment,
} from "../../../api/community.js";
import {
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setModal,
  setConfirmMessageTxt,
} from "../../../redux";
import { useSelector, useDispatch } from "react-redux";
import ConfirmBox from "../../../components/modules/ConfirmBox";
import TimeAgo from "javascript-time-ago";
import ReplyCommentForm from "./ReplyCommentForm";
import ReplyCommentList from "./ReplyCommentList";

const CommentHeader = (props) => {
  const { data, onDelete } = props;
  const editCommentInput = React.useRef(null);
  const timeAgo = new TimeAgo("en-US");
  timeAgo.format(new Date());
  const userProfile = data.userDetail;
  const limitCount = 200;
  const info = useSelector((state) => state.info);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const myCommunity = useSelector((state) => state.myCommunity.data);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(false);
  const [isExpand, setExpand] = useState(false);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const myProfile = useSelector((state) => state.myProfile.data);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [isCommunityAdmin, setIsCommunityAdmin] = useState(false);
  const [isOwnFeed, setIsOwnFeed] = useState(false);
  const role = useSelector((state) => state.myProfile.data.role);
  const [isOwnComment, setIsOwnComment] = useState(false);
  const [mode, setMode] = useState("");
  const [publishAt, setPublicAt] = useState(new Date());
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === data.feedId)
  );
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const [replyList, setReplyList] = useState([]);
  const [repliesCount, setRepliesCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [type, setType] = useState("");
  const [confirmBoxStatus, setConfirmBoxStatus] = useState(false);
  const tab = useSelector((state) => state.info.communityHeaderTab);
  const [feedId, setFeedId] = useState(0);
  const [commentId, setCommentId] = useState(0);
  const [replyStatus, setReplyStatus] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // feedId
  useEffect(() => {
    console.log(data);
    console.log(feed);
    setType(feed.type);
    setIsOrgAdmin(userRole === "admin");
    setIsOwnFeed(feed.createdBy === info.userId);
    setIsOwnComment(data.userId === info.userId);
    setIsLiked(data.isLiked);
    
      myCommunity && myCommunity.length>0 && setIsCommunityAdmin(
        myCommunity.filter(
          (item) =>
            item._id === feed.communityId && item.createdBy === info.userId
        ).length > 0
      );
    
   
    setPublicAt(new Date(data.createdAt));
    console.log(data);
    setRepliesCount(data.repliesCount);
    setLikesCount(data.likesCount);
    setComment(data.comment);
    setFeedId(data.feedId);
    setCommentId(data._id);
  }, [data]);

  useEffect(() => {
    console.log("datachange", comment.length, limitCount);
    if (comment.length > limitCount) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
  }, [comment]);

  useEffect(() => {
    let abortController = new AbortController();
    if (replyStatus === true) {
      getReplyList({
        commentId: commentId,
        appId,
        token,
      })
        .then(async (response) => {
          if (response.status === 200) {
            let replyComments = [...response.data.data.replyOfComment];
            console.log(replyComments.length);
            let userList = response.data.data.replyOfComment.map(
              (item) => item.userId
            );
            console.log(response);
            setRepliesCount(response.data.data.replyCount);
            let usersSets = new Set(userList);
            let uniqueUsers = Array.from(usersSets);
            let userDetails = await getUsersDetail({
              userIds: uniqueUsers,
              appId,
              token,
            })
              .then((res) => res.data.data)
              .catch((error) => error.res);
            setReplyList(
              replyComments.map((item) => {
                let data = { ...item };
                data.userDetail = userDetails.find(
                  (user) => user._id === item.userId
                );
                return data;
              })
            );
          }
        })
        .catch((error) => console.error(error));
    }

    return () => {
      abortController.abort();
    };
  }, [replyStatus]);
  const vieMore = () => {
    setExpand(true);
  };
  const isReplyEnable = () => {
    if (
      replyStatus &&
      role === "user" &&
      communityHeaderTab === "conversations" &&
      communityHeaderTab !== "deleted" &&
      feed.deleted === false
    ) {
      return true;
    } else if (
      replyStatus &&
      role === "admin" &&
      feed.status === "Live" &&
      feed.deleted === false
    ) {
      return true;
    } else {
      return false;
    }
  };
  const isLikeEnable = () => {
    if (
      role === "user" &&
      communityHeaderTab === "conversations" &&
      feed.deleted === false
    ) {
      return true;
    } else if (
      role === "admin" &&
      feed.status === "Live" &&
      feed.deleted === false
    ) {
      return true;
    } else {
      return false;
    }
  };
  const viewLess = () => {
    setExpand(false);
  };
  const toggleLike = () => {
    try {
      isLikeEnable() === true &&
        toogleLikeComment({
          commentId: data._id,
          appId,
          token,
        }).then((response) => {
          if (response.status === 200) {
            setLikesCount(response.data.data.likeCount);
            setIsLiked(response.data.data.likeOfComment.liked);
          } else {
            dispatch(setMessageBox(true));
            dispatch(
              setMessageTxt("Something went wrong while liking comment.")
            );
            dispatch(setMessageBoxCloseBtn(true));
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  const toggleReply = () => {
    setReplyStatus(!replyStatus);
  };
  const confirmDelete = () => {
    try {
      dispatch(setModal(false));
      setConfirmBoxStatus(false);
      dispatch(setMessageBox(true));

      dispatch(
        setMessageTxt(
          `Deleting  ${type === "Discussion" ? "Comment" : "Answer"}  ...`
        )
      );
      dispatch(setMessageBoxCloseBtn(false));
      removeComment();
    } catch (error) {
      console.error(error);
    }
  };
  const hideConfirmBox = () => {
    try {
      dispatch(setModal(false));
      dispatch(setConfirmMessageTxt(""));
      setConfirmBoxStatus(false);
    } catch (error) {
      console.error(error);
    }
  };
  const showConfirmBox = () => {
    try {
      dispatch(setModal(true));
      dispatch(
        setConfirmMessageTxt(
          `Do you want to delete  ${
            type === "Discussion" ? "comment" : "answer"
          } ? `
        )
      );
      setConfirmBoxStatus(true);
    } catch (error) {
      console.error(error);
    }
  };
  const removeComment = () => {
    try {
      deleteComment({
        commentId: data._id,
        appId,
        token,
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            onDelete(data._id);
            dispatch(setMessageTxt(response.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
          } else {
            dispatch(setMessageTxt(response.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const updateComment = () => {
    let commentTxt = editCommentInput.current.value.split("").join("");
    console.log(commentTxt);
    if (editCommentInput.current.value.length === 0) {
      return false;
    }
    dispatch(setMessageBox(true));
    dispatch(
      setMessageTxt(
        `Editing ${type === "Discussion" ? "comment" : "answer"} ...`
      )
    );
    dispatch(setMessageBoxCloseBtn(false));
    console.log(commentTxt);
    editComment({
      commentId: data._id,
      comment: commentTxt,
      appId,
      token,
    })
      .then((response) => {
        console.log(response);
        console.log(commentTxt);
        if (response.status === 200) {
          dispatch(setMessageBox(false));
          setComment(commentTxt);
          setPublicAt(new Date(response.data.data.updatedAt));
          if (commentTxt.length > limitCount) {
            setHasMore(true);
          }
          setExpand(false);

          setMode("");
        } else {
          dispatch(setMessageTxt(response.data.metadata.message));
          dispatch(setMessageBoxCloseBtn(true));
          setComment(commentTxt);
          setMode("");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const addReply = (data) => {
    setRepliesCount(data.replyCount);
    let replyData = { ...data.replyOfComment };
    replyData.userDetail = myProfile;
    let replyListData = [...replyList];
    setReplyList([{ ...replyData }, ...replyListData]);
  };
  const checkKey = (e) => {
    e.preventDefault();
    if (e.keyCode === 13 && e.target.value.length > 0) {
      updateComment();
    }
  };
  return (
    <>
      <div className="comment-user-info">
        <div className="img-wrap">
          <img
            alt={userProfile.firstName + " " + userProfile.lastName}
            title={userProfile.firstName + " " + userProfile.lastName}
            src={
              userProfile.profilePic
                ? userProfile.profilePic
                : process.env.REACT_APP_SITE_URL + "avatar0.svg"
            }
            alt="member"
            loading="lazy"
          />
        </div>

        <div className="info-wrap">
          <div className="header">
            <h5>
              <div>
                {userProfile.firstName} {userProfile.lastName}
              </div>
              <span>{timeAgo.format(new Date(publishAt))} </span>
            </h5>

            {/* Condition for Organization Admin */}
            <div className="headerRight">
              <div className="tinyNav">
                <button
                  className={`eachTinyNav ${
                    isLikeEnable() === true ? "enabled" : "disabled"
                  }`}
                  onClick={toggleLike}
                >
                  {isLiked ? (
                    <img
                      width="12"
                      height="12"
                      alt="Like Comment"
                      alt="Like Comment"
                      src={
                        process.env.REACT_APP_SITE_URL +
                        "icon-color-thumbs-lg.svg"
                      }
                    />
                  ) : (
                    <img
                      width="12"
                      height="12"
                      alt="Like Comment"
                      alt="Like Comment"
                      src={
                        process.env.REACT_APP_SITE_URL +
                        "icon-like-thumbs-lg.svg"
                      }
                    />
                  )}

                  <span>{likesCount}</span>
                </button>
                <button className="eachTinyNav" onClick={toggleReply}>
                  <img
                    width="12"
                    height="12"
                    title="Reply Comment"
                    alt="Reply Comment"
                    src={process.env.REACT_APP_SITE_URL + "reply.svg"}
                  />
                  <span>{repliesCount}</span>
                </button>
              </div>

              {(isOwnComment || isCommunityAdmin || isOrgAdmin) &&
                tab === "conversations" &&
                isOrgAdmin &&
                feed.status === "Live" &&
                feed.deleted === false && (
                  <div className="popUpComment">
                    <img
                      src={process.env.REACT_APP_SITE_URL + "icon-ellipsis.svg"}
                    />
                    <div className="adminNav">
                      <button onClick={() => setMode("edit")}>
                        <span className="img">
                          <img
                            src={
                              process.env.REACT_APP_SITE_URL +
                              "icon-settings.svg"
                            }
                          />
                        </span>{" "}
                        <span>Edit</span>
                      </button>
                      <button onClick={() => showConfirmBox()}>
                        <span className="img">
                          <img
                            src={
                              process.env.REACT_APP_SITE_URL +
                              "icon-trash-light.svg"
                            }
                          />
                        </span>{" "}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}

              {/* Condition for normal user */}
              {(isOwnComment || isCommunityAdmin) &&
                tab === "conversations" &&
                !isOrgAdmin && (
                  <div className="popUpComment">
                    <img
                      src={process.env.REACT_APP_SITE_URL + "icon-ellipsis.svg"}
                    />
                    <div>
                      <button onClick={() => setMode("edit")}>
                        <span className="img">
                          <img
                            src={
                              process.env.REACT_APP_SITE_URL +
                              "icon-settings.svg"
                            }
                          />
                        </span>{" "}
                        <span>Edit</span>
                      </button>
                      <button onClick={() => showConfirmBox()}>
                        <span className="img">
                          <img
                            src={
                              process.env.REACT_APP_SITE_URL +
                              "icon-trash-light.svg"
                            }
                          />
                        </span>{" "}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="h4">
            {hasMore && !isExpand ? (
              <div>{comment.slice(0, 200)}</div>
            ) : (
              <div>{comment}</div>
            )}

            {hasMore && !isExpand && (
              <button className="moreBtn" onClick={vieMore}>
                view more ...
              </button>
            )}
            {hasMore && isExpand && (
              <button className="moreBtn" onClick={viewLess}>
                view less ...
              </button>
            )}

            {mode === "edit" && (
              <div className="editCommentForm">
                <input
                  type="text"
                  onKeyUp={(e) => checkKey(e)}
                  onChange={() => {}}
                  value={comment}
                  ref={editCommentInput}
                  className="form-control"
                />{" "}
                <button onClick={() => updateComment()} className="comment-btn">
                  Edit
                </button>
              </div>
            )}
          </div>

          {replyStatus && replyList && replyList.length > 0 && (
            <ReplyCommentList data={replyList} commentId={commentId} />
          )}
          {isReplyEnable() === true && (
            <ReplyCommentForm
              commentId={commentId}
              onAddReply={(data) => addReply(data)}
            />
          )}
        </div>
      </div>{" "}
      {confirmBoxStatus ? (
        <ConfirmBox onYes={confirmDelete} onNo={hideConfirmBox} />
      ) : (
        ""
      )}
    </>
  );
};

export default React.memo(CommentHeader);
