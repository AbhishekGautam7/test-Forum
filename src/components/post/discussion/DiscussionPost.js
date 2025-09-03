import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import AttachmentFiles from "../modules/AttachmentFiles";
import Slider from "../modules/Slider";
import Tags from "../modules/Tags";
import Users from "../modules/Users";
import Gallery from "../gallery/Gallery";
import EditFeed from "../../EditFeed";
import { convertDate } from "../../../libary/date";

function DiscussionPost(props) {
  const { feedId } = props;
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isGallery, setIsGallery] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [mode, setMode] = useState("");
  const [isMaxDesc, setIsMaxDesc] = useState(false);
  const [descClass, setDescClass] = useState("");
  const [showReadMore, setShowReadMore] = useState(true);

  const desc = useRef(null);

  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );

  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );

  const mycommunity = useSelector((state) => state.myCommunity);

  useEffect(() => {
    try {
      let attachments =
        feed && feed.attachments && feed.attachments.length > 0
          ? JSON.parse(feed.attachments)
          : [];

      let mygallery =
        attachments &&
        attachments.length > 0 &&
        attachments.filter(
          (item) => item.fileType === "image" || item.fileType === "video"
        );
      let docs =
        attachments &&
        attachments.length > 0 &&
        attachments.filter(
          (item) => item.fileType !== "image" && item.fileType !== "video"
        );

      feed && feed.content && setContent(feed.contents);

      feed &&
        feed.contents &&
        feed.contents.title &&
        setTitle(() => feed.contents.title);
      feed &&
        feed.contents &&
        feed.contents.description &&
        setDescription(() => content.description);
      feed && feed.contents && feed.tags && setTags(feed.contents.tags);
      feed && feed.contents && feed.userIds && setTags(feed.content.userIds);

      docs && setAttachmentFiles(() => docs);
      mygallery && setGallery(() => mygallery);
    } catch (error) {
      console.error(error);
    }
  }, [props, feed]);

  useEffect(() => {
    if (desc.current) {
      if (desc.current.clientHeight > 100) {
        setIsMaxDesc(true);
      } else {
        setIsMaxDesc(false);
      }
    }
  }, [description, feed]);
  const openSlider = (index) => {
    try {
      setIsGallery(() => false);
      setSliderIndex(() => index);
    } catch (error) {
      console.error(error);
    }
  };

  const expandDescription = () => {
    setShowReadMore(false);
    setDescClass("expand");
  };
  const collapseDescription = () => {
    setShowReadMore(true);
    setDescClass("");
  };
  return (
    <>
      {feed && feed.mode && feed.mode === "edit" ? (
        <EditFeed communityId={feed.communityId} feedId={feed._id} />
      ) : (
        <>
          <div className="member-body">
            {title && (
              <div className="title">
                <b>{title}</b>
              </div>
            )}
            <div
              className={`descWrapper ${descClass} ${isMaxDesc ? "max" : ""}`}
            >
              {feed && feed.contents && feed.contents.description && (
                <div
                  ref={desc}
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: `${feed.contents.description}`,
                  }}
                />
              )}
            </div>

            {isMaxDesc && showReadMore && (
              <button className="readmore linkBtn" onClick={expandDescription}>
                View more
              </button>
            )}
            {isMaxDesc && !showReadMore && (
              <button
                className="readmore linkBtn"
                onClick={collapseDescription}
              >
                View less
              </button>
            )}
          </div>
          <div className="post-img-wrap h-auto">
            {gallery && gallery.length > 0 && isGallery && (
              <Gallery
                attachments={gallery}
                onIndex={(index) => openSlider(index)}
              />
            )}
            {!isGallery && (
              <Slider
                index={sliderIndex}
                gallery={gallery}
                onBack={() => setIsGallery(true)}
              />
            )}
          </div>
          {attachmentFiles && attachmentFiles.length > 0 && (
            <AttachmentFiles files={attachmentFiles} />
          )}
          {(communityHeaderTab === "scheduled" ||
            (feed?.status === "Scheduled" && feed?.deleted === false)) && (
            <div className="startEndDate">
              <div className="startAt">
                <span className="lbl">Start at</span>
                <div className="rightOpt">
                  <span>:</span>
                  <img
                    src={process.env.REACT_APP_SITE_URL + "time.svg"}
                    alt=""
                    title="Schedule Start Date"
                  />
                  {feed.startDate && <span>{convertDate(feed.startDate)}</span>}
                </div>
              </div>
              <div className="endAt">
                <span className="lbl">End at</span>
                <div className="rightOpt">
                  <span>:</span>
                  <img
                    src={process.env.REACT_APP_SITE_URL + "time.svg"}
                    alt="Schedule End Date"
                    title="Schedule End Date"
                  />
                  {feed.endDate && <span>{convertDate(feed.endDate)}</span>}
                </div>
              </div>
            </div>
          )}
          {feed &&
            feed.contents &&
            feed.contents.tags &&
            feed.contents.tags.length > 0 && (
              <Tags feedId={feed._id} data={feed.contents.tags} />
            )}
          {feed?._id &&
            feed.contents &&
            feed?.contents?.usersDetails?.length > 0 && <Users id={feed._id} />}
        </>
      )}
    </>
  );
}
export default DiscussionPost;
