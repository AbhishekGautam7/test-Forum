import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setStatusCreateCommunity,
  setModal,
  setFeeds,
  setCommunityId,
  setPage,
  setCurrentCommunity,
  setPost,
  setCommuinityHeaderTab,
  setAllCommunity,
  setTodaysCommunity,
  setLoading,
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setFeedIdList,
  setMyCommunity,
  setFeedsName,
  setTotalFeed,
  hasMoreFeed,
  setSearchBoxStatus,
  setAllCommunityStatus,
} from "../../redux";
import AllCommunities from "../AllCommunities";
import TodaysCommunity from "./TodaysCommunity";
import { SITE_URL } from "../../api/community.js";

import SearchBox from "../modules/SearchBox";

import {
  getAllCommunity,
  getTodaysCommunity,
  fetchOrgFeeds,
} from "../../api/orgAdmin";

function OrgAdminLeft() {
  const dispatch = useDispatch();
  const info = useSelector((state) => state.info);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const allCommunity = useSelector((state) => state.allCommunity.data);
  const [mycommmunityLoading, setMycommmunityLoading] = useState(null);
  const [loadDeleted, setLoadDeleted] = useState(false);
  const [setDeletdCommunities] = useState([]);
  const count = useSelector((state) => state.feeds.perPageFeed);

  const hidePop = () => {
    dispatch(setSearchBoxStatus(false));
  };

  const openCreateCommunityModal = () => {
    try {
      dispatch(setStatusCreateCommunity(true));
      dispatch(setModal(true));
    } catch (error) {
      console.error(error);
    }
  };

  const queryAllCommunity = async (payload) => {
    try {
      if (!mycommmunityLoading) {
        setMycommmunityLoading("loading");

        await getAllCommunity(payload)
          .then((res) => {
            setMycommmunityLoading(null);
            if (loadDeleted) {
              setDeletdCommunities(res);
            } else {
              dispatch(setAllCommunity(res));
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const todaysCommunityList = async (payload) => {
    try {
      await getTodaysCommunity(payload)
        .then((res) => {
          if (res && res.status && res.status === 200) {
            dispatch(setTodaysCommunity(res.data.data));
          } else {
            console.error("Something error on queryFavoriteCommunityList");
          }
        })
        .catch((error) => {
          console.error("Error on getFavoriteCommunityList", error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let abortController = new AbortController();

    let date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    // const currentDate = date.toLocaleDateString();
    const currentDate = year + "-" + month + "-" + day;

    let payload = {
      currentDate,
      deleted: loadDeleted,
      appId,
      token,
    };

    queryAllCommunity(payload);

    return () => {
      abortController.abort();
    };
  }, [loadDeleted, setLoadDeleted]);

  const showPublicFeeds = () => {
    try {
      let payload = {
        count,
        token,
        appId,
      };

      dispatch(setFeeds([]));
      dispatch(setLoading("Loading all feeds .."));
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Loading your feeds ..."));
      dispatch(setMessageBoxCloseBtn(false));

      fetchOrgFeeds(payload)
        .then((res) => {
          dispatch(setCommunityId(null));
          dispatch(setFeeds(res.list));

          dispatch(setCommunityId(null));
          dispatch(setMyCommunity([]));
          dispatch(setFeedIdList(res.list.map((item) => item._id)));
          dispatch(hasMoreFeed(res.metadata.hasMore));
          dispatch(setFeedsName("home"));
          dispatch(setTotalFeed(res.metadata.totalCount));

          dispatch(setPage("home"));

          let date = new Date();
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          let currentDate = year + "-" + month + "-" + day;

          let queryAllCommunityAPI = queryAllCommunity({
            currentDate,
            deleted: loadDeleted,
            appId,
            token,
          });
          let todaysCommunityListAPI = todaysCommunityList({
            currentDate,
            deleted: loadDeleted,
            appId,
            token,
          });

          Promise.allSettled([
            queryAllCommunityAPI,
            todaysCommunityListAPI,
          ]).then((results) => {
            dispatch(setCurrentCommunity({}));
            dispatch(setPost(""));
            dispatch(setCommuinityHeaderTab());
            dispatch(setLoading(false));
            dispatch(setAllCommunityStatus(true));
            dispatch(setMessageBox(false));
          });
        })
        .catch((error) => console.error(error.response));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="col-xs-12 col-lg-12 col-xl-3 lightBg">
      <div className="community-left-sidebar">
        <SearchBox />
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
        <div onClick={() => hidePop()}>
          <TodaysCommunity title="Todays Community" />
          <AllCommunities title="All Communities" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(OrgAdminLeft);
