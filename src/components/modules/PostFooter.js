import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import PostTrigger from "../modules/PostTrigger";

function PostFooter(props) {
  const [attachmentBoxStatus, setAttachmentBoxStatus] = useState(false);

  const fileUploaderEle = useRef(null);
  const attachmentFile = useRef(null);
  const videoInput = useRef(null);

  const feed = useSelector((state) =>
    state.feeds && state.feeds.data && state.feeds.data.length > 0
      ? state.feeds.data.find((item) => item._id === props.feedId)
      : []
  );

  return (
    <div className="posting-section-footer">
      <div className="posting-edit-wrap">
        {feed && feed.mode && feed.mode === "edit" ? (
          ""
        ) : (
          <ul className="posting-option-list">
            <li>
              <PostTrigger active={props.active} />
            </li>
          </ul>
        )}

        <ul className="posting-text-list ">
          <li>
            <button
              title="Bold"
              className="linkBtn"
              onClick={() => props.onFormat("bold")}
            >
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-bold.svg"}
                alt="icon"
                loading="lazy"
              />
            </button>
          </li>
          <li>
            <button
              title="Italic"
              className="linkBtn"
              onClick={() => props.onFormat("italic")}
            >
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-italic.svg"}
                alt="icon"
                loading="lazy"
              />
            </button>
          </li>
          <li>
            <button
              title="Order List"
              className="linkBtn"
              onClick={() => props.onFormat("insertorderedlist")}
            >
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-number-points.svg"}
                alt="icon"
                loading="lazy"
              />
            </button>
          </li>
          <li>
            <button
              title="Unorder List"
              className="linkBtn"
              onClick={() => props.onFormat("insertunorderedlist")}
            >
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-bullet-points.svg"}
                alt="icon"
                loading="lazy"
              />
            </button>
          </li>
          <li>
            <button
              title="Link"
              className="linkBtn"
              onClick={() => props.onSetUrl()}
            >
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-pin-link.svg"}
                alt="icon"
                loading="lazy"
              />
            </button>
          </li>
        </ul>
      </div>
      <input
        type="file"
        ref={fileUploaderEle}
        multiple
        accept="image/png, image/gif, image/jpeg, image/jpg"
        className="d-none"
        onChange={(e) => props.onUploadFiles(e)}
        onClick={(e) => e.stopPropagation()}
      />
      <ul className="posting-post-list">
        {/* */}
        <li>
          <button
            className="btnLink setTime"
            onClick={() => props.onSetIsStartEndDate()}
            title="Set Start and End Date"
          >
            <img
              src={process.env.REACT_APP_SITE_URL + "time.svg"}
              alt="icon"
              loading="lazy"
              width="16"
            />
          </button>
        </li>
        <li>
          <button
            className="btnLink"
            onClick={() => props.onSetIsTopic(true)}
            title="Add Topics"
          >
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-community-topic.svg"}
              alt="icon"
              loading="lazy"
            />
          </button>
        </li>

        <li>
          <button
            onClick={() => fileUploaderEle.current.click()}
            title="Add Images Files"
          >
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-gif.svg"}
              alt="icon"
              loading="lazy"
            />
          </button>
        </li>
        <li>
          <button
            className="video btnLink"
            onClick={() => videoInput.current.click()}
            title="Add Video Files"
          >
            <img
              src={process.env.REACT_APP_SITE_URL + "video.svg"}
              alt="icon"
              loading="lazy"
            />
          </button>
          <input
            ref={videoInput}
            type="file"
            className="d-none"
            accept=".mp4"
            onChange={(e) => props.onUploadFiles(e)}
          />
        </li>
        <li>
          <input
            type="file"
            ref={attachmentFile}
            onChange={(e) => props.onUploadFiles(e)}
            multiple
            className="d-none"
            accept=".xlsx,.xls,.zip,.rar,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          />
          <button
            title="Attachment Files"
            className="linkBtn dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={() => attachmentFile.current.click()}
          >
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-attach.svg"}
              alt="icon"
              loading="lazy"
            />
          </button>
          {attachmentBoxStatus && (
            <ul className="dropdown-menu dropdown-menu-end show">
              <li>work in progress...</li>
            </ul>
          )}
        </li>
        <li>
          <button
            disabled={!props.isValidForm}
            type="button"
            className="posting-btn"
            onClick={() => props.onCreateDiscussionPost()}
          >
            Post
          </button>
        </li>
      </ul>
    </div>
  );
}

export default React.memo(PostFooter);
