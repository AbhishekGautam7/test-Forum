import React from "react";
function PostReaction(props) {
  const { likeCount } = props;
  return (
    <>
      <div className="post-line"></div>
      <div className="total-member-reaction">
        <div className="emo-wrap">
          
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-color-thumbs-lg.svg"}
              alt="icon"
              loading="lazy"
            />
          
          {/* <a href="#">
            <img src="./assets/img/icon-emo.svg" alt="icon" loading="lazy" />
          </a> */}
        </div>
        <span className="reaction-text" >
          {likeCount} likes
        </span>
      </div>
    </>
  );
}
export default React.memo(PostReaction);
