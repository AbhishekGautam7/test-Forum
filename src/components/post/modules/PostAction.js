import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../../../api/feed";
import { setCommentStatus } from "../../../redux";

function PostAction(props) {
  const { feedId, myCommunity } = props;

  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch(); // ✅ Correct: remove "new"

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const [type, setType] = useState("");
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const [isMyCommunityFeed, setIsMyCommunityFeed] = useState(true);

  useEffect(() => {
    if (feed && myCommunity?.length > 0) {
      setType(feed.type);
      setIsLiked(feed.isLiked);

      if (Array.isArray(myCommunity)) {
        setIsMyCommunityFeed(
          myCommunity.some((item) => item._id === feed.communityId)
        );
      }
    }
  }, [feed, myCommunity]);

  const onLikeHandler = async () => {
    if (!feed) return;
    const payload = {
      feedId: feed._id,
      appId,
      token,
    };

    try {
      const res = await likePost(payload);
      if (res.status === 200) {
        setIsLiked(res.data.data.isLiked);
        props.setLikeCount(res.data.data.likesCount);
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  return (
    <>
      <div className="post-line"></div>

      <div className="member-reation-holder">
        {(communityHeaderTab !== "scheduled" &&
          communityHeaderTab !== "past" &&
          communityHeaderTab !== "deleted" &&
          isMyCommunityFeed &&
          !feed.deleted &&
          !feed?.status) ||
        (feed.status &&
          feed.status !== "Scheduled" &&
          feed.status !== "Ended" &&
          !feed.deleted) ? (
          <div className="like-wrap">
            <button onClick={onLikeHandler}>
              <img
                src={
                  process.env.REACT_APP_SITE_URL +
                  (isLiked
                    ? "icon-color-thumbs-lg.svg"
                    : "icon-like-thumbs-lg.svg")
                }
                height="19"
                width="19"
                alt="icon"
                loading="lazy"
              />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
          </div>
        ) : (
          <div className="nupe"></div>
        )}

        <div className="comment-wrap">
          <button onClick={() => dispatch(setCommentStatus(feed._id))}>
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-comment.svg"}
              alt="icon"
              loading="lazy"
            />
            {feed.commentCount > 0 && <span>{feed.commentCount}</span>}
            &nbsp;
            <span>
              {feed.commentCount <= 1
                ? type === "Discussion"
                  ? "Comment"
                  : "Answer"
                : type === "Discussion"
                ? "Comments"
                : "Answers"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default PostAction;
