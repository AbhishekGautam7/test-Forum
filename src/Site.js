import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import Home from "./pages/Home";
import CommunitiesPage from "./pages/CommunitiesPage";
import OrgAdmin from "./pages/OrgAdmin";
import Search from "./pages/Search";
import MobileApp from "./pages/mobileApp";

import ErrorBoundary from "./components/ErrorBoundary";
import { useIsMobileView } from "./hooks";
import { getUserDetail } from "./api/community";

import {
  setAllCommunity,
  setAllCommunityStatus,
  setAppId,
  setFavorite,
  setLoadSearchResult,
  setMyCommunity,
  setOrgId,
  setPublicCommunity,
  setSearchAttachmentList,
  setSearchCommunityId,
  setSearchCommunityList,
  setSearchFrom,
  setSearchKeyword,
  setSearchMemberList,
  setSearchTab,
  setSearchTo,
  setSearchTopics,
  setSearchType,
  setTodaysCommunity,
  setToken,
  setUserId,
  setMyProfile,
  setSearchBoxKeyword,
  setSearchBoxStatus,
} from "./redux";

/* Info Redux */
import {
  setBox,
  setCommuinityHeaderTab,
  setCommunityId,
  setCurrentFeedId,
  setEditCommunityStatus,
  setInviteUsersStatus,
  setLoading,
  setModal,
  setPage,
  setPost,
  setStatusCreateCommunity,
  setTag,
} from "./redux";

/* Community redux */
import {
  changeCommunityDescription,
  changeCommunityName,
  changeEndDate,
  changeStartDate,
  setPrivateStatus,
} from "./redux";

/* feeds redux */
import {
  hasMoreFeed,
  setFeedIdList,
  setFeeds,
  setFeedsName,
  setTotalFeed,
} from "./redux";

/* confirm box redux */
import {
  setConfirmMessagBoxFeedAction,
  setConfirmMessagBoxFeedId,
  setConfirmMessageBox,
} from "./redux";

function Site(props) {
  const [role, setRole] = useState("");
  const dispatch = useDispatch();

  const page = useSelector((state) => state.info.page);
  const userId = useSelector((state) => state.info.userId);
  const isModal = useSelector((state) => state.info.isModal);
  const socket = useSelector((state) => state.socket.socket);

  const { isMobileView } = useIsMobileView({});
  const inputEl = useRef(null);

  function defaultDispatch() {
    /* Reset everything back to defaults */
    dispatch(setAllCommunityStatus(true));
    dispatch(setAllCommunity([]));

    dispatch(changeCommunityName(""));
    dispatch(changeCommunityDescription(""));
    dispatch(changeStartDate(null));
    dispatch(changeEndDate(null));
    dispatch(setPrivateStatus(false));

    dispatch(setLoading(false));
    dispatch(setBox("discussion"));
    dispatch(setPage("home"));
    dispatch(setStatusCreateCommunity(false));
    dispatch(setEditCommunityStatus(false));
    dispatch(setModal(false));
    dispatch(setPost("welcome"));
    dispatch(setCommunityId(null));
    dispatch(setInviteUsersStatus(false));
    dispatch(setCommuinityHeaderTab("conversations"));
    dispatch(setTag(""));
    dispatch(setCurrentFeedId(null));

    dispatch(setFeeds([]));
    dispatch(setFeedsName(""));
    dispatch(hasMoreFeed(false));
    dispatch(setFeedIdList([]));
    dispatch(setTotalFeed(0));

    dispatch(setConfirmMessageBox(false));
    dispatch(setConfirmMessageBox(""));
    dispatch(setConfirmMessagBoxFeedId(null));
    dispatch(setConfirmMessagBoxFeedAction(""));

    dispatch(setFavorite([]));
    dispatch(setPublicCommunity([]));

    dispatch(setSearchKeyword(""));
    dispatch(setSearchCommunityList([]));
    dispatch(setSearchMemberList([]));
    dispatch(setSearchAttachmentList([]));
    dispatch(setSearchTab(""));
    dispatch(setLoadSearchResult(false));
    dispatch(setSearchType(""));
    dispatch(setSearchTopics([]));
    dispatch(setSearchTo(""));
    dispatch(setSearchFrom(""));
    dispatch(setSearchCommunityId(""));

    dispatch(setSearchBoxStatus(false));
    dispatch(setSearchBoxKeyword(""));

    dispatch(setTodaysCommunity([]));
    dispatch(setMyCommunity([]));
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Load app.css
  useEffect(() => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/assets/css/app.css"
        : "https://grinds360-community-forum.s3.eu-west-1.amazonaws.com/app.css";

    defaultDispatch();
    inputEl.current.appendChild(link);
  }, []);

  // Load suneditor css
  useEffect(() => {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/suneditor@2.45.1/dist/css/suneditor.min.css";

    defaultDispatch();
    inputEl.current.appendChild(link);
  }, []);

  // Init user
  useEffect(() => {
    dispatch(setAppId(props.appid));
    dispatch(setToken(props.token));

    getUserDetail({ token: props.token })
      .then((response) => {
        if (response && response.status === 200) {
          setRole(response?.data?.data?.role);
          dispatch(setMyProfile(response?.data?.data));
          dispatch(setUserId(response?.data?.data?._id));
          dispatch(setOrgId(response?.data?.data?.organisation?._id));
        }
      })
      .catch((error) => console.error(error));
  }, [dispatch, props.appid, props.token]);

  useEffect(() => {
    document.body.style.overflow = isModal ? "hidden" : "inherit";
  }, [isModal]);

  return (
    <div ref={inputEl}>
      {isMobileView ? (
        <ErrorBoundary>
          <MobileApp />
        </ErrorBoundary>
      ) : (
        <>
          {userId && role === "admin" && <OrgAdmin />}

          {userId && role === "user" && (
            <div>
              {page === "home" || page === "eachcommunity" ? (
                <ErrorBoundary>
                  <Home />
                </ErrorBoundary>
              ) : page === "search" ? (
                <ErrorBoundary>
                  <Search />
                </ErrorBoundary>
              ) : page === "suggestedCommunities" ||
                page === "myCommunities" ||
                page === "favoriteCommunities" ? (
                <ErrorBoundary>
                  <CommunitiesPage />
                </ErrorBoundary>
              ) : (
                <span>No home</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

Site.propTypes = {
  appid: PropTypes.string,
  token: PropTypes.string,
};

export default Site;
