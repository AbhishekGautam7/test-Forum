import React, { useEffect, useState } from "react";
import { getCommentList } from "../../../api/feed";
import { useSelector } from "react-redux";
import { getSingleFeed } from "../../../api/community";
import CreateComment from "./CreateComment";
import CommentHeader from "./CommentHeader";

function Comment(props) {
  const { feedId, onDeleteComment, onSetCommentCount } = props;
  const [comments, setComments] = useState([]);
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const [totalcommentCount, setTotalCommentCount] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [commentCount, setCommentCount] = useState(3);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const [isMyCommunityFeed,setIsMyCommunityFeed] = useState(true);
  const myCommunity = useSelector((state) => state.myCommunity.data);
  const myProfile = useSelector((state) => state.myProfile);
  const [moreStatus, setMoreStatus] = useState(false);

  const [type, setType] = useState("");
  const role = useSelector((state) => state.myProfile.data.role);
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const onNewComment = (comment) => {
    let mycomment = { ...comment };
    mycomment.userDetail = myProfile.data;

    setComments([...comments, mycomment]);
    setTotalCommentCount(totalcommentCount + 1);
    if (moreStatus) {
      setCommentCount(commentCount + 1);
    }
  };

  useEffect(() => {
    //console.log("zzzs")
    console.log(feed);
    setType(feed.type);
    if (myCommunity && myCommunity instanceof Array) {
      setIsMyCommunityFeed(
        myCommunity.filter((item) => item._id === feed.communityId).length > 0
      );
    }

    getSingleFeed({
      feedId: feedId,
      appId,
      token,
    }).then((response) => {
      console.log(response[0].commentCount);
      if (response[0].commentCount > 0) {
        getCommentList({
          feedId: feed._id,
          commentCount: response[0].commentCount,
          appId,
          token,
        })
          .then((res) => {
            console.log(res);
            setComments(res);
            setTotalCommentCount(res.length);
            onSetCommentCount({
              feedId: feedId,
              commentCount: res.length,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
      }
    });
  }, []);

  const onViewAllCommentClick = () => {
    setCommentCount(moreStatus ? 3 : totalcommentCount);
    setMoreStatus(!moreStatus);
  };

  const deleteComment = (id) => {
    console.log("deleteComment", id);

    setComments(comments.filter((item) => item._id !== id));
    setTotalCommentCount(totalcommentCount - 1);
    onDeleteComment(id);
  };
  const createCommentStatus = () => {
    if (
      role === "user" &&
      communityHeaderTab == "conversations" &&
      communityHeaderTab !== "deleted" &&
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

  return (
    <>
      {totalcommentCount <= 3 ? (
        <div className="pb-3"></div>
      ) : (
        <div className="view-all-comments">
          <button onClick={onViewAllCommentClick}>
            View {moreStatus == true ? "less" : "all"}{" "}
            {type === "Discussion" ? "comments" : "answers"}
          </button>
        </div>
      )}
      {comments &&
        comments.length > 0 &&
        comments.map((comment, index) =>
          index < commentCount ? (
            <div key={comment._id} className="comment-section-box">
              <CommentHeader
                data={comment}
                setUserImage={setProfilePic}
                onDelete={(id) => deleteComment(id)}
              />
            </div>
          ) : (
            ""
          )
        )}
      {createCommentStatus() === true ? (
        <CreateComment
          feedData={feed}
          newComments={onNewComment}
          userImage={profilePic}
          key={feed._id}
          feedId={feedId}
        />
      ) : (
        ""
      )}{" "}
    </>
  );
}

export default React.memo(Comment);
