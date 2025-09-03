import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCommentCount } from "../../../redux";
import { addComment } from "../../../api/feed";

function CreateComment(props) {
  const [comment, setComment] = useState("");
  const { feedId, newComments } = props;
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const myProfile = useSelector((state) => state.myProfile);
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const putComment = (e) => {
    setComment(() => e.target.value);
  };
  useEffect(() => {
    setType(feed.type);
  }, []);
  const onSubmit = () => {
    console.log("Sening comment", comment);
    if (comment.length > 0) {
      let payload = {
        feedId: feedId,
        comment,
        appId,
        token
      };

      addComment(payload)
        .then((res) => {
          newComments(res.data.data.comment);
          dispatch(
            setCommentCount({
              feedId: feedId,
              commentCount: res.data.data.commentCount,
            })
          );
        })
        .catch((error) => {
          let errMsg = "Error on adding " + type;
          console.log(errMsg, error);
        });

      setComment(() => "");
    }
  };

  console.log("feed status check", !feed.status || feed.status === "Live");
  const checkKey = (e) => {
    if (e.keyCode === 13) {
      onSubmit();
    }
  };
  return (
    <>
      <div className="comment-section-box comment-serach-box">
        <div className="comment-user-info">
          <button className="img-wrap">
            <img
              alt={myProfile.data.firstName + " " + myProfile.data.lastName}
              title={myProfile.data.firstName + " " + myProfile.data.lastName}
              src={
                myProfile.data.profilePic
                  ? myProfile.data.profilePic
                  : process.env.REACT_APP_SITE_URL + "avatar0.svg"
              }
              alt="member"
              loading="lazy"
            />
          </button>
          <input
            className="form-control me-2"
            type="search"
            placeholder={
              type === "Discussion"
                ? "Write your comment here"
                : type === "Question"
                ? "Write your answer here"
                : ""
            }
            aria-label="Search"
            onChange={(e) => putComment(e)}
            onKeyUp={(e) => checkKey(e)}
            value={comment}
          />
        </div>
        <button className="comment-btn" onClick={onSubmit}>
          {type === "Discussion"
            ? "Comment"
            : type === "Question"
            ? "Answer"
            : ""}
        </button>
      </div>
    </>
  );
}

export default React.memo(CreateComment);
