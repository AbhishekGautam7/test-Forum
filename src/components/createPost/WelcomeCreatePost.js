import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../redux";
function WelcomeCreatePost() {
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.myProfile);

  useEffect(() => {
    console.log("Welcome to my profile ", myProfile);
  }, [myProfile]);
  return (
    <div className="common-box">
      <button
        className="start-discussion-link active"
        onClick={() => dispatch(setPost("discussion"))}
      >
        <div className="img-wrap">
          <img
            src={
              myProfile.data.profilePic
                ? myProfile.data.profilePic
                : process.env.REACT_APP_SITE_URL + "avatar0.svg"
            }
            alt={myProfile.data.firstName + " " + myProfile.data.lastName}
            title={myProfile.data.firstName + " " + myProfile.data.lastName}
            loading="lazy"
          />
        </div>
        <span>Start a discussion</span>
      </button>

      <div className="line"></div>

      <ul className="start-discussion-list">
        <li>
          <button disabled className="active">
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-discussion.svg"}
              alt="icon"
              loading="lazy"
            />
            <span>Discussion</span>
          </button>
        </li>
        <li>
          <button onClick={() => dispatch(setPost("question"))}>
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-black-question.svg"}
              alt="icon"
              loading="lazy"
            />
            <span>Question</span>
          </button>
        </li>
        {/* <li>
          <button onClick={() => dispatch(setPost("praise"))}>
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-black-praise.svg"}
              alt="icon"
              loading="lazy"
            />
            <span>Praise</span>
          </button>
        </li>
        <li>
          <button onClick={() => dispatch(setPost("poll"))}>
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-black-poll.svg"}
              alt="icon"
              loading="lazy"
            />
            <span>Poll</span>
          </button>
        </li> */}
      </ul>
    </div>
  );
}

export default React.memo(WelcomeCreatePost);
