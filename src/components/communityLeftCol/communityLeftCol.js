import { useCallback, useEffect, useState } from "react";

import CommunityBlock from "./communityBlock";
import FilterBlock from "./filterBlock";

import InfiniteScroller from "../chats/modules/infiniteScroller";
import { useDispatch, useSelector } from "react-redux";

import { useGetCommunityList } from "./useGetCommunityList";

import { useDebounce } from "../chats/hooks";

import {
  hasMoreFeed,
  setAllCommunity,
  setCommuinityHeaderTab,
  setCommunityId,
  setCurrentCommunity,
  setFeedIdList,
  setFeeds,
  setFeedsName,
  setLoading,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setModal,
  setMyCommunity,
  setPage,
  setPost,
  setPublicCommunity,
  setStatusCreateCommunity,
  setTotalFeed,
} from "../../redux";

import {
  getAllFeed,
  getAllPublicCommunityList,
  getCommunityList,
  getUsersDetail,
} from "../../api/community";

import { getAllCommunity } from "../../api/orgAdmin";

import ErrorBoundary from "../ErrorBoundary";
import { useCreateDefaultCommunity, useGetDefaultCommunity } from "../../hooks/index";
import useChatStore from "../../stores/chatStore";

const CommunityLeftCol = ({
  isMobile = false,
  hideSidebar,
  setHideSidebar,
  setTabIndex,
}) => {
  const [selectedcommunityId, setSelectedCommunityId] = useState("");

  const [isPublicOrPrivate, setIsPublicOrPrivate] = useState("");
  const [isCommunityAdmin, setIsCommunityAdmin] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const [searchValue, setSearchValue] = useState();

  const [isAPICall, setStartAPICall] = useState(false);

  const currentCommunity = useSelector((state) => state.currentCommunity.data);

  const [mycommmunityLoading, setMycommmunityLoading] = useState(null);
  const [myFeedActive, setMyFeedActive] = useState(true);

  const { setUnSeenMessageCount } = useChatStore((store) => store);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.info.token);

  const appId = useSelector((state) => state.info.appId);
  const perPageFeed = useSelector((state) => state.feeds.perPageFeed);

  const searchQuery = useDebounce(searchValue, 500);

  const socket = useSelector((state) => state.socket.socket);

  const userId = useSelector((state) => state.info.userId);

  const userRole = useSelector((state) => state.myProfile.data.role);

  const {
    isLoading,
    hasNextPage,
    communityList,
    fetchNextPage,
    setCommunityList,
  } = useGetCommunityList({
    state: isPublicOrPrivate,
    search: searchQuery,
    isJoined,
    isCreator: isCommunityAdmin,
    isFavourite,
  });

  const { isLoading: isCreatingDefaultCommunity, mutate } =
    useCreateDefaultCommunity();

  const { defaultCommunity } = useGetDefaultCommunity();

  useEffect(() => {
    /* current_community */
    if (defaultCommunity) {
      dispatch(setCommunityId(defaultCommunity?.details?._id));
      getUsersDetail({
        token,
        userIds: defaultCommunity?.details?.communityUsers,
      }).then((res) =>
        dispatch(
          setCurrentCommunity({
            ...defaultCommunity?.details,
            communityUsers: res?.data?.data,
            doesDefaultCommunityExist: !!defaultCommunity?.details,
            canCreateDefaultCommunity:
              defaultCommunity?.canCreateDefaultCommunity,
          })
        )
      );
    }
  }, [defaultCommunity, dispatch, token]);

  useEffect(() => {
    socket?.on(
      `unReadMessageCounts-${userId}`,

      (res) => {
        if (currentCommunity?._id === res?.data?.communityId) {
          setUnSeenMessageCount({
            ...res?.data?.counts,
          });
        }

        let communityListCopy = [...communityList];

        // if (
        //   res?.data?.counts.total !== undefined ||
        //   res?.data?.counts.total !== null
        // ) {
        let indexToChangeCount = communityListCopy?.findIndex(
          (community) => community._id === res?.data?.communityId
        );

        if (communityListCopy[indexToChangeCount]) {
          communityListCopy[indexToChangeCount].totalUnreadMessages =
            res?.data?.counts?.total ?? 0;

          setCommunityList(communityListCopy);
        }
        // }
      }
    );

    return () => {
      socket?.off(`unReadMessageCounts-${userId}`);
    };
  }, [
    communityList,
    currentCommunity,
    setCommunityList,
    setUnSeenMessageCount,
    socket,
    userId,
  ]);

  function handleChange(value) {
    setSearchValue(value);
  }

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

  const queryAllCommunity = async (payload) => {
    try {
      if (!mycommmunityLoading) {
        setMycommmunityLoading("loading");

        await getAllCommunity(payload)
          .then((res) => {
            setMycommmunityLoading(null);

            dispatch(setAllCommunity(res));
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const queryMyCommunity = useCallback(
    async (payload) => {
      try {
        if (!mycommmunityLoading) {
          setMycommmunityLoading("loading");

          await getCommunityList(payload)
            .then((res) => {
              setMycommmunityLoading(null);
              dispatch(setMyCommunity(res?.data?.data?.communities));
            })
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, mycommmunityLoading]
  );

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
      deleted: false,
      appId,
      token,
      limit: 10,
    };

    if (userRole === "admin") {
      queryAllCommunity(payload);
    } else if (userRole === "user") {
      queryMyCommunity({
        appId,
        token,
      });
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const {
    setIsCreateGroupFormOpen,
    setIsGroupDetailBoxOpen,
    setIsGroupSettingBoxOpen,
    setIsAddOrRemoveGroupMembersBoxOpen,
    showBlockedAndUnBlockedUsersList,
    setIsMyFeedButtonClicked,
  } = useChatStore((store) => store);

  const resetAllState = () => {
    setIsCreateGroupFormOpen(false);
    setIsGroupDetailBoxOpen(false);
    setIsGroupSettingBoxOpen(false);
    setIsAddOrRemoveGroupMembersBoxOpen(false);
    showBlockedAndUnBlockedUsersList(false);
  };

  const showPublicFeeds = () => {
    try {
      setMyFeedActive(true);
      setIsMyFeedButtonClicked(true);

      if (setHideSidebar) {
        setHideSidebar(true);
      }

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
          dispatch(setMyCommunity([]));
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
          if (defaultCommunity) {
            dispatch(setCommunityId(defaultCommunity?.details?._id));
            getUsersDetail({
              token,
              userIds: defaultCommunity?.details?.communityUsers,
            }).then((res) =>
              dispatch(
                setCurrentCommunity({
                  ...defaultCommunity?.details,
                  communityUsers: res?.data?.data,
                  canCreateDefaultCommunity:
                    defaultCommunity?.canCreateDefaultCommunity,
                  doesDefaultCommunityExist: !!defaultCommunity?.details,
                })
              )
            );
          }
          dispatch(setPost(""));
          dispatch(setCommuinityHeaderTab(""));
          dispatch(setLoading(false));
          dispatch(setMessageBox(false));
        })
        .catch((error) => console.error(error.response));
      resetAllState();
    } catch (error) {
      console.error(error);
      setMyFeedActive(false);
    }
  };

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

  function isMobileView() {
    if (isMobile) {
      if (hideSidebar) {
        return "mobile-left inactive";
      } else {
        return "mobile-left";
      }
    }
  }

  return (
    <div className={`col-xs-12 col-lg-12 col-xl-3 lightBg ${isMobileView()}`}>
      <ErrorBoundary>
        <div className="community-left-col-wrapper">
          <button
            className="my-feed"
            style={{
              background: myFeedActive ? "#ebf7ed" : "",
            }}
            onClick={() => showPublicFeeds()}
          >
            My feed
          </button>

          {currentCommunity?.canCreateDefaultCommunity && (
            <button
              className="my-feed"
              // style={{
              //   background: myFeedActive ? "#ebf7ed" : "",
              // }}
              onClick={mutate}
              disabled={isCreatingDefaultCommunity}
            >
              Create Default Community
            </button>
          )}

          <div className="community-wrapper">
            <span className="community-title">Communities</span>

            {userRole === "user" ? (
              defaultCommunity?.details?.chatSetting
                ?.canLearnerCreateCommunity === true ? (
                <button
                  className="create-community-btn"
                  onClick={openCreateCommunityModal}
                >
                  {/* <img src={AddIcon} alt="create community" /> */}

                  <img
                    src={process.env.REACT_APP_SITE_URL + "icon-black-add.svg"}
                    alt="create community"
                  />
                </button>
              ) : (
                <></>
              )
            ) : (
              <button
                className="create-community-btn"
                onClick={openCreateCommunityModal}
              >
                {/* <img src={AddIcon} alt="create community" /> */}

                <img
                  src={process.env.REACT_APP_SITE_URL + "icon-black-add.svg"}
                  alt="create community"
                />
              </button>
            )}
          </div>

          <div className="position-relative">
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-gary-search.svg"}
              alt="community search"
              loading="lazy"
              className="search-icon"
            />
            <input
              type="text"
              placeholder="Search Community"
              className="search-community"
              value={searchValue}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>

          <FilterBlock
            isJoined={isJoined}
            isFavourite={isFavourite}
            isCommunityAdmin={isCommunityAdmin}
            isPublicOrPrivate={isPublicOrPrivate}
            setIsJoined={setIsJoined}
            setIsFavourite={setIsFavourite}
            setIsCommunityAdmin={setIsCommunityAdmin}
            setIsPublicOrPrivate={setIsPublicOrPrivate}
          />

          {isLoading ? (
            <div
              className="w-100 d-flex justify-content-center align-items-center"
              style={{
                height: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              Loading communities...
            </div>
          ) : (
            <div
              style={{
                // height: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              <InfiniteScroller
                loadMore={async () => {
                  if (isAPICall) return;
                  setStartAPICall(true);
                  await fetchNextPage();
                  setTimeout(() => {
                    setStartAPICall(false);
                  }, 2000);
                }}
                hasMore={hasNextPage && !isAPICall}
              >
                {communityList?.map((community) => {
                  return (
                    <CommunityBlock
                      setTabIndex={setTabIndex}
                      key={community._id}
                      isMobile={isMobile}
                      community={community}
                      setHideSidebar={setHideSidebar}
                      setMyFeedActive={setMyFeedActive}
                      selectedcommunityId={selectedcommunityId}
                      setSelectedCommunityId={setSelectedCommunityId}
                    />
                  );
                })}
                {communityList && communityList?.length === 0 && (
                  <div
                    className="w-100 d-flex justify-content-center align-items-center"
                    style={{
                      height: "400px",
                    }}
                  >
                    No communities found
                  </div>
                )}
              </InfiniteScroller>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CommunityLeftCol;
