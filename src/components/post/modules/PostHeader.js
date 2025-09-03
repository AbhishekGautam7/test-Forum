import React, { useEffect, useState } from "react";
import { deletePost } from "../../../api/community";
import { deletePostByAdmin, restorePostByAdmin } from "../../../api/orgAdmin";
import { useSelector, useDispatch } from "react-redux";
import {
  setConfirmMessageTxt,
  deleteFeedById,
  setFeedMode,
  setModal,
  setMessageBox,
  setMessageTxt,
  setConfirmMessagBoxFeedId,
  deleteFeedByAdmin,
  setMessageBoxCloseBtn,
  deleteFeedIdListById,
  setCurrentFeedId,
  setFeedDeletedStatus,
} from "../../../redux";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json"; // <-- import locale
import ConfirmBox from "../../modules/ConfirmBox";

// Register locale globally
TimeAgo.addLocale(en);

function PostHeader(props) {
  const { feedId } = props;
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const [isOwnFeed, setIsOwnFeed] = useState(false);
  const [postDate, setPostDate] = useState(new Date());
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const userId = useSelector((state) => state.info.userId);
  const orgId = useSelector((state) => state.info.orgId);
  const [isCommunityAdmin, setIsCommunityAdmin] = useState(false);
  const timeAgo = new TimeAgo("en-US"); // <-- TimeAgo instance with locale
  const [mode, setMode] = useState("");
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const userRole = useSelector((state) => state.myProfile.data.role);
  const page = useSelector((state) => state.info.page);
  const [feedID, setFeedId] = useState("");
  const [confirmBoxStatus, setConfirmBoxStatus] = useState(false);
  const dispatch = useDispatch();
  const currentCommunity = useSelector((state) => state.currentCommunity.data);

  useEffect(() => {
    setIsCommunityAdmin(() => currentCommunity.createdBy === userId);
    setProfilePic(feed?.info?.profilePic || "");
    setUserName(
      feed?.info?.firstName && feed?.info?.lastName
        ? `${feed.info.firstName} ${feed.info.lastName}`
        : ""
    );

    setPostDate(new Date(feed.createdAt));

    if (feed && feed.createdBy && userId) {
      setIsOwnFeed(
        () => feed.createdBy === userId || feed.communityAdmin === userId
      );
    }
    setFeedId(feedId);
    setMode(feed.mode || null);
  }, [userId, orgId, feedId, mode, feed, currentCommunity]);

  const changeMode = (val) => {
    dispatch(setCurrentFeedId(feedId));
    dispatch(setFeedMode({ id: feedId, mode: val }));
    setMode(val);
  };

 const confirmDelete = () => {
    try {
      if (userRole === "user") {
        deletePost({
          feedId: feed._id,
          appId,
          token,
        })
          .then((response) => {
            if (response.status === 200) {
              dispatch(deleteFeedById(feed._id));
              dispatch(deleteFeedIdListById(feed._id));
              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
            } else {
              console.error("Error response", response.data.metadata.message);
              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
            }
          })
          .catch((error) => console.error(error));
      } else if (userRole === "admin") {
        deletePostByAdmin({
          feedId: feed._id,
          appId,
          token,
        })
          .then((response) => {
            if (response.status === 200) {
              if (page === "home" || page === "search") {
                dispatch(deleteFeedByAdmin(feed._id));
              } else if (page === "eachcommunity") {
                dispatch(deleteFeedById(feed._id));
              }

              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
            } else {
              console.error("Error response", response.data.metadata.message);
              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
              dispatch(setMessageBoxCloseBtn(true));
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRestore = () => {
    try {
      /*
      Only Community Admin and Organisation Admin can restore feed. Normall user can not delete his own feed too.
      Community Admin behaviour  : deleted feed from store
      Orgnisation Admin behaviour : just change the status of deleted property. No need to remove feed from store.
      */
      if (userRole === "admin" || isCommunityAdmin === true) {
        restorePostByAdmin({ feedId: feed._id, appId, token })
          .then((response) => {
            if (response.status === 200) {
              if (isCommunityAdmin === true) {
                dispatch(deleteFeedById(feed._id));
              }
              if (userRole === "admin") {
                
                // If User is in Community Header . Need to remove Feed other wise just change value of deleted property
                if(communityHeaderTab==="deleted"){
                  dispatch(deleteFeedById(feed._id));
                }else{
                  dispatch(
                    setFeedDeletedStatus({ _id: feed._id, status: false })
                  );
                }
              }

              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
              dispatch(setMessageBoxCloseBtn(true));
            } else {
              console.error("Error response", response.data.metadata.message);
              dispatch(setMessageBox(true));
              dispatch(setMessageTxt(response.data.metadata.message));
              dispatch(setMessageBoxCloseBtn(true));
            }
          })
          .catch((error) =>
            console.error("Error from restore feed api", error)
          );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hideConfirmBox = () => {
    dispatch(setModal(false));
    dispatch(setConfirmMessageTxt(""));
    dispatch(setConfirmMessagBoxFeedId(feed._id));
    setConfirmBoxStatus(false);
  };
  const removePost = () => {
    try {
      dispatch(setCurrentFeedId(feedId));

      dispatch(setModal(true));
      dispatch(setConfirmMessageTxt("Are you sure you want to delete ? "));
      dispatch(setMessageBoxCloseBtn(true));
      setConfirmBoxStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="member-header">
        <div className="member-info">
          <div href="#" className="img-wrap">
            <img
              src={
                profilePic
                  ? profilePic
                  : process.env.REACT_APP_SITE_URL + "avatar0.svg"
              }
              loading="lazy"
            />
          </div>
          <div className="info-wrap">
            <div>
              <b>{userName || ""}</b>
            </div>
            <span>
              {timeAgo.format(new Date(postDate))}.{" "}
              <span>{feed?.communityName || ""}</span>
            </span>
          </div>
        </div>

        {/* ribbons, dropdowns, buttons... keep your existing code */}

      </div>

      {confirmBoxStatus && (
        <ConfirmBox feed={feed} onYes={() => confirmDelete()} onNo={hideConfirmBox} />
      )}
    </>
  );
}

export default PostHeader;
