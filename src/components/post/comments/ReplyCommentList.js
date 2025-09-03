import React from "react";
import TimeAgo from "javascript-time-ago";
function ReplyCommentList(props) {
  const timeAgo = new TimeAgo("en-US");
  timeAgo.format(new Date());
  const { data } = props;

  return (
    <div className="replyCommentList">
      {data && data.length > 0 && (
        <ul>
          {data.map((item) => {
            return (
              <li key={item._id}>
                <div className="replyHeader">
                  <img
                    src={
                      item && item.userDetail && item.userDetail.profilePic
                        ? item.userDetail.profilePic
                        : process.env.REACT_APP_SITE_URL + "avatar0.svg"
                    }
                    width="24"
                    height="24"
                    alt={
                      item.userDetail.firstName + " " + item.userDetail.lastName
                    }
                    title={
                      item.userDetail.firstName + " " + item.userDetail.lastName
                    }
                  />
                  <span className="userName">
                    {item.userDetail.firstName + " " + item.userDetail.lastName}
                  </span>
                  <span className="timeAgo">
                   
                    {timeAgo.format(new Date(item.updatedAt))}
                  </span>
                </div>

                <div className="reply">{item.reply}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
export default React.memo(ReplyCommentList);
