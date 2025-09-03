import React, { useEffect, useState, useRef } from "react";
import AttachmentFiles from "../modules/AttachmentFiles";
import Slider from "../modules/Slider";
import Tags from "../modules/Tags";
import Gallery from "../gallery/Gallery";
import Users from "../modules/Users";
import { convertDate } from "../../../libary/date";
import { useSelector } from "react-redux";
import EditFeed from "../../EditFeed";

function QuestionPost(props) {
  const { feedId } = props;
  const [isGallery, setIsGallery] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);
  const desc = useRef(null);
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const modee = useSelector(
    (state) => state.feeds.data.find((item) => item._id === feedId).mode
  );
  const [isMaxDesc, setIsMaxDesc] = useState(false);
  const [descClass, setDescClass] = useState("");
  const [showReadMore, setShowReadMore] = useState(true);
  
  useEffect(() => {
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

    feed && feed.attachments && docs && setAttachmentFiles(() => docs);
    attachments && mygallery && setGallery(() => mygallery);
  }, [modee]);

  const openSlider = (index) => {
    setIsGallery(() => false);
    setSliderIndex(() => index);
    console.log("Need to show ", index);
  };
  useEffect(() => {
    if (desc && desc.current) {
      if (desc.current.clientHeight > 100) {
        setIsMaxDesc(true);
      } else {
        setIsMaxDesc(false);
      }
    }
  }, []);

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
        <EditFeed feedId={feed._id} />
      ) : (
        <>
          <div className="card common-card">
            <div className="card-header">
              <div className="card-box-holder">
                <div className="card-box">
                  <img
                    src={
                      process.env.REACT_APP_SITE_URL + "icon-white-question.svg"
                    }
                    alt="icon"
                    loading="lazy"
                  />
                </div>
                <span>Question : </span>
              </div>
            </div>
            <div className="card-body question-content">
              {feed && feed.contents && feed.contents.question && (
                <div
                  className={`descWrapper ${descClass} ${
                    isMaxDesc ? "max" : ""
                  }`}
                >
                  <span
                    ref={desc}
                    dangerouslySetInnerHTML={{
                      __html: `${feed.contents.question}`,
                    }}
                  ></span>
                </div>
              )}
              {isMaxDesc && showReadMore && (
                <button
                  className="readmore linkBtn"
                  onClick={expandDescription}
                >
                  View more
                </button>
              )}
              {showReadMore === false && (
                <button
                  className="readmore linkBtn"
                  onClick={collapseDescription}
                >
                  View less
                </button>
              )}
            </div>
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
            (feed.status === "Scheduled" && feed.deleted === false)) && (
            <div className="startEndDate">
              <div className="startAt">
                <span className="lbl">Start at</span>
                <div className="rightOpt">
                  <span>:</span>
                  <img src={process.env.REACT_APP_SITE_URL + "time.svg"} />
                  {feed && feed.startDate && (
                    <span>{convertDate(feed.startDate)}</span>
                  )}
                </div>
              </div>
              <div className="endAt">
                <span className="lbl">End at</span>
                <div className="rightOpt">
                  <span>:</span>
                  <img src={process.env.REACT_APP_SITE_URL + "time.svg"} />
                  {feed && feed.endDate && (
                    <span>{convertDate(feed.endDate)}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {feed &&
            feed.contents &&
            feed.contents.tags &&
            feed.contents.tags.length > 0 && (
              <Tags feedId={feed._id} data={feed.contents.tags} />
            )}{" "}
          {feed?._id &&
            feed.contents?.usersDetails &&
            feed?.contents?.usersDetails?.length > 0 && <Users id={feed._id} />}
        </>
      )}
    </>
  );
}
export default QuestionPost;
