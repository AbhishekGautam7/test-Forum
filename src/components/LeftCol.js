import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  setStatusCreateCommunity,
  setModal,
  setMyCommunity,
  setFeeds,
  setCommunityId,
  setPage,
  setCurrentCommunity,
  setPost,
  setCommuinityHeaderTab,
  setPublicCommunity,
  setLoading,
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setFeedIdList,
  hasMoreFeed,
  setFeedsName,
  setTotalFeed,
  setSearchBoxStatus,
} from "../redux";

import MyCommunities from "./MyCommunities";

import FavoriteCommunity from "./FavoriteCommunity";

import {
  getMyCommunityList,
  getAllFeed,
  SITE_URL,
  getAllPublicCommunityList,
} from "../api/community.js";
import SearchBox from "../components/modules/SearchBox";

function LeftCol() {
  const dispatch = useDispatch();
  const info = useSelector((state) => state.info);
  const token = useSelector((state) => state.info.token);

  const appId = useSelector((state) => state.info.appId);

  const [mycommmunityLoading, setMycommmunityLoading] = useState(null);
  const perPageFeed = useSelector((state) => state.feeds.perPageFeed);

  const openCreateCommunityModal = () => {
    try {
      dispatch(setStatusCreateCommunity(true));
      dispatch(setModal(true));
      dispatch(setPage("home"));
      dispatch(setCommuinityHeaderTab());
    } catch (error) {
      console.error(error);
    }
  };

  const queryMyCommunity = async (payload) => {
    try {
      if (!mycommmunityLoading) {
        setMycommmunityLoading("loading");
        await getMyCommunityList(payload)
          .then((res) => {
            setMycommmunityLoading(null);
            if (Array.isArray(res)) {
              dispatch(setMyCommunity(res));
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPublicCommunityList = () => {
    let payload = {
      count: 10,
      appId,
      token,
    };
    getAllPublicCommunityList(payload).then((res) => {
      if (res) {
        dispatch(setPublicCommunity(res));
      }
    });
  };

  const showPublicFeeds = () => {
    try {
      let payload = {
        appId,
        token,
      };

      payload.count = perPageFeed;
      payload.page = 1;

      dispatch(setFeeds([]));
      dispatch(setLoading("Loading all feeds .."));
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Loading your feeds ..."));
      dispatch(setMessageBoxCloseBtn(false));

      getAllFeed(payload)
        .then((res) => {
          console.log("getAllFeed *************************", res);
          dispatch(setFeeds(res.list));
          dispatch(setFeedIdList(res.list.map((item) => item._id)));
          dispatch(setCommunityId(null));
          dispatch(setMyCommunity({}));
          dispatch(hasMoreFeed(res.metadata.hasMore));
          dispatch(setFeedsName("home"));
          dispatch(setTotalFeed(res.metadata.totalCount));

          // Update My Community
          queryMyCommunity({
            appId,
            token,
          });

          fetchPublicCommunityList();

          dispatch(setPage("home"));
          dispatch(setCommunityId(null));
          dispatch(setCurrentCommunity({}));
          dispatch(setPost(""));
          dispatch(setCommuinityHeaderTab(""));
          dispatch(setLoading(false));
          dispatch(setMessageBox(false));
        })
        .catch((error) => console.error(error.response));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="col-xs-12 col-lg-12 col-xl-3 leftCol">
      <div className="community-left-sidebar">
        <SearchBox />
        <div onClick={() => dispatch(setSearchBoxStatus(false))}>
          <ul className="community-feed-list">
            <li>
              <button
                className={`linkBtn ${info.page === "home" ? "active" : ""}`}
                onClick={() => showPublicFeeds()}
              >
                <img
                  src={SITE_URL + "icon-home-feed.svg"}
                  alt="your feed"
                  loading="lazy"
                />
                <span>Your Feed</span>
              </button>
            </li>
          </ul>

          <button
            className="create-community-btn common-community-btn"
            data-bs-toggle="modal"
            data-bs-target="#createCommunityModal"
            onClick={openCreateCommunityModal}
          >
            <img
              src={SITE_URL + "icon-blue-add.svg"}
              alt="community add"
              loading="lazy"
            />
            Create a Community
          </button>

          <div className="line"></div>
          <FavoriteCommunity title="Favorite Community" />
          <MyCommunities title="My Communities" />
        </div>
      </div>
    </div>
  );
}
export default React.memo(LeftCol);
