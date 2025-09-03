import React, { useState } from "react";
import { createReply } from "../../../api/community";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
} from "../../../redux";

function ReplyCommentForm(props) {
  const { commentId, onAddReply } = props;
  const [replyMsg, setReplyMsg] = useState("");
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const myProfile = useSelector((state) => state.myProfile);
  const setMsg = (e) => {
    setReplyMsg(e.target.value.trim());
  };
  const dispatch = useDispatch();
  const sendReply = () => {
    //props.onSendReply(replyMsg);
    if (replyMsg.length === 0) {
      return false;
    }
    let payload = {
      commentId: commentId,
      reply: replyMsg,
      appId,
      token,
    };

    setReplyMsg("");
    createReply(payload)
      .then((response) => {
        if (response.status === 200) {
          onAddReply(response.data.data);
        } else {
          dispatch(setMessageBox(true));
          dispatch(setMessageBoxCloseBtn(true));
          dispatch(
            setMessageTxt("Something went wrong while sending reply messsage.")
          );
        }
        console.log(response);
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="replyForm">
      <div className="leftSide">
        <div className="img">
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
        </div>

        <input
          className="comment"
          type="text"
          value={replyMsg}
          onChange={(e) => setMsg(e)}
        />
      </div>
      <div className="rightSide">
        <button
          className="sendComment"
          disabled={replyMsg.length === 0}
          onClick={() => sendReply()}
        >
          <img
            className="xs-only"
            src={process.env.REACT_APP_SITE_URL + "enter.svg"}
          />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
}
export default ReplyCommentForm;
