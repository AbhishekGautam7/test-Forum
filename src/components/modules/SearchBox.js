import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFeeds,
  setCommunityId,
  setCurrentCommunity,
  setPage,
  setPost,
  setCommuinityHeaderTab,
  setSearchKeyword,
  setSearchCommunityList,
  setSearchTab,
  setLoadSearchResult,
  setSearchType,
  setSearchTopics,
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setFeedIdList,
  hasMoreFeed,
  setSearchBoxStatus,
  setFeedsName,
  setTag,
  setSearchBoxKeyword,
} from "../../redux";
import {
  searchCommunityByKeyword,
  getCommunityDetail,
  getAllFeed,
  getTopicsByKeyword,
  getFeedByTag,
  advanceSearchCommunity,
} from "../../api/community";

function SearchBox() {
  const dispatch = useDispatch();
  const searchBoxInput = useRef(null);
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const searchTopics = useSelector((state) => state.search.topics);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [topics, setTopics] = useState([]);
  const [communityLoaded, setCommunityLoaded] = useState(false);
  const [tagsLoaded, setTagsLoaded] = useState(false);
  const searchBoxStatus = useSelector((state) => state.searchBox.status);
  const userRole = useSelector((state) => state.myProfile.data.role);

  const showSearchPage = (e) => {
    e.preventDefault();
    dispatch(setSearchTab(""));
    dispatch(setSearchTopics(false));
    setSearchBoxStatus(false);
    setSearchTxt("");
    dispatch(setPage("search"));
    dispatch(setSearchKeyword(searchTxt));
    dispatch(setCommuinityHeaderTab(""));
    dispatch(setSearchTab("conversations"));
    dispatch(setLoadSearchResult(true));
    dispatch(setSearchBoxStatus(false));
    dispatch(hasMoreFeed(false));
    dispatch(setSearchType("private"));
  };

  const communities = useSelector((state) => state.search.communityList);
  const [communityList, setCommunityList] = useState([]);
  useEffect(() => {
    let abortController = new AbortController();
    setCommunityList(communities);
    setTopics(searchTopics);
    return () => {
      abortController.abort();
    };
  }, [communities, searchTopics]);
  const closeSearchBox = () => {
    try {
      dispatch(setSearchBoxStatus(false));
      setSearchTxt("");
    } catch (error) {
      console.error(error);
    }
  };
  const searchForLearner = () => {
    searchCommunityByKeyword({
      keyword: searchTxt,
      appId,
      token,
    }).then((response) => {
      if (response && response.status === 200) {
        setCommunityLoaded(true);

        if (response.data.data.length > 0) {
          dispatch(setSearchCommunityList(response.data.data));
        } else {
          dispatch(setSearchCommunityList([]));
        }
      }
    });

    getTopicsByKeyword({
      keyword: searchTxt,
      appId,
      token,
    }).then((res) => {
      if (res && res.data && res.data.data) {
        dispatch(setSearchTopics(res.data.data));
        setTagsLoaded(true);
      }
    });
  };
  const searchForOrgAdmin = () => {
    let abortController = new AbortController();

    advanceSearchCommunity({
      keyword: searchTxt,
      appId,
      token,
    }).then((response) => {
      dispatch(setSearchCommunityList(response));
      setCommunityLoaded(true);
    });
    getTopicsByKeyword({
      keyword: searchTxt,
      status: userRole === "admin" ? "all" : "live",
      appId,
      token,
    }).then((res) => {
      if (res && res.data && res.data.data) {
        dispatch(setSearchTopics(res.data.data));
        setTagsLoaded(true);
      }
    });
    return () => {
      abortController.abort();
    };
  };

  const searchingByKeyWord = (e) => {
    try {
      let searchTxt = e.target.value;
      if (searchTxt.length > 0) {
        setCommunityLoaded("Loading");
        setTagsLoaded("Loading");
        dispatch(setSearchBoxStatus(true));
        userRole === "admin" ? searchForOrgAdmin() : searchForLearner();
      } else {
        setShowSearchResult(false);
        dispatch(setSearchBoxStatus(false));
        dispatch(setSearchKeyword(""));
        dispatch(setSearchCommunityList([]));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const searchByKeyWord = (e) => {
    try {
      setSearchTxt(e.target.value);
      dispatch(setSearchBoxKeyword(e.target.value));
      if (e.target.value.length === 0) {
        dispatch(setSearchBoxStatus(false));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const firstChar = (text) => {
    try {
      if (text.length > 0) {
        let splitTxt = text.split(" ");
        let txt = splitTxt[0].charAt(0);
        if (splitTxt.length > 1) {
          txt = txt + splitTxt[1].charAt(0);
        }
        return txt;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const displayName = (name, start, end) => {
    try {
      let communityname = name.split("");

      return communityname.map((item, index) => {
        return (
          <span
            key={index}
            className={index >= start && index < end ? "active" : ""}
          >
            {item}
          </span>
        );
      });
    } catch (error) {
      console.error(error);
    }
  };
  const setCommunity = (item) => {
    try {
      dispatch(setFeeds([]));
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Loading feeds ..."));
      dispatch(setMessageBoxCloseBtn(false));
      dispatch(setSearchBoxStatus(false));
      getCommunityDetail({
        communityId: item._id,
        appId,
        token,
      })
        .then((response) => {
          if (response && response.status && response.status === 200) {
            dispatch(setCommunityId(item._id));
            dispatch(setCurrentCommunity(response.data.data));

            dispatch(setPost(""));
            dispatch(setCommuinityHeaderTab(""));
            getAllFeed({
              communityId: item._id,
              appId,
              token,
            }).then((response) => {
              response && response.list && dispatch(setFeeds(response.list));

              dispatch(setFeedIdList(response.list.map((item) => item._id)));
              dispatch(hasMoreFeed(response.metadata.hasMore));

              dispatch(setSearchKeyword(""));
              dispatch(setSearchCommunityList([]));
              setSearchTxt("");
              dispatch(setPage("eachcommunity"));
              dispatch(setMessageBox(false));
            });
          } else {
            console.error("Error :", response);
            dispatch(
              setMessageTxt("Something went wrong while fetching feeds")
            );
            dispatch(setMessageBox(true));
          }
        })
        .catch((error) => console.error("Error on getCommunityDetail", error));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeedByTag = (tag) => {
    dispatch(setMessageBox(true));
    dispatch(setMessageBoxCloseBtn(false));
    dispatch(setMessageTxt("Searching feeds with tag of #" + tag));
    dispatch(setTag(tag));
    dispatch(setSearchBoxStatus(false));
    dispatch(setFeedsName("tagsearch"));
    dispatch(setCommuinityHeaderTab(""));
    let payload = {
      keyword: tag,
      status: userRole === "admin" ? "all" : "live",
      appId,
      token,
    };

    getFeedByTag(payload).then((response) => {
      if (response.length === 0) {
        dispatch(setMessageTxt("No data found"));
        dispatch(setMessageBoxCloseBtn(true));
        setSearchTxt("");
        window.scrollTo(0, 0);
      } else {
        dispatch(setPage("home"));
        dispatch(setCommunityId(null));
        dispatch(setCurrentCommunity({}));
        dispatch(setFeeds(response.list));
        dispatch(setMessageBox(false));
        dispatch(setFeedIdList(response.list.map((item) => item._id)));
        dispatch(hasMoreFeed(response.metadata.hasMore));
        dispatch(setMessageBoxCloseBtn(true));
        dispatch(setMessageTxt(""));

        setSearchTxt("");
        window.scrollTo(0, 0);
      }
    });
  };
  return (
    <>
      <div className="community-search-holder">
        <div className="input-group flex-nowrap community-search">
          <span className="input-group-text">
            {
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-gary-search.svg"}
                alt="community search"
                loading="lazy"
              />
            }
          </span>

          <div className="inputSearchBox">
            {(searchBoxStatus === true || searchTxt.length > 0) && (
              <img
                className="close"
                onClick={() => closeSearchBox()}
                width="15"
                height="15"
                src={process.env.REACT_APP_SITE_URL + "icon-close.svg"}
              />
            )}
            <input
              value={searchTxt}
              type="text"
              className="form-control"
              placeholder="Search in community"
              aria-label="Find"
              ref={searchBoxInput}
              aria-describedby="addon-wrapping"
              onChange={(e) => searchByKeyWord(e)}
              onKeyUp={(e) => searchingByKeyWord(e)}
              onFocus={(e) => dispatch(setSearchBoxStatus(true))}
              onClick={(e) => closeSearchBox()}
            />
          </div>
        </div>

        {searchBoxStatus === true && (
          <div
            className="search-dropdown-content"
            id="searchDropdown"
            style={{ display: "block" }}
          >
            <h4>Community</h4>

            {communityList && communityList.length > 0 ? (
              <ul className="community-search-list">
                {communityLoaded === true &&
                  communityList &&
                  communityList.length > 0 &&
                  communityList.map((item, index) => {
                    return (
                      <li key={item._id}>
                        <button onClick={() => setCommunity(item)}>
                          <div className="img-wrap">
                            <span>{firstChar(item.name)}</span>
                          </div>
                          <div className="info-wrap">
                            <h5>
                              {displayName(
                                item.name,
                                item.name
                                  .toLowerCase()
                                  .search(searchTxt.toLowerCase()),
                                searchTxt.length + item.name.search(searchTxt)
                              )}
                            </h5>
                            <p>
                              {item.description.slice(0, 50)}{" "}
                              {item.description.length > 50 ? (
                                <span>...</span>
                              ) : (
                                ""
                              )}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            ) : communityLoaded === true &&
              communityList &&
              communityList.length == 0 ? (
              <div className="small-txt">No Community Found</div>
            ) : communityLoaded === "Loading" ? (
              <div className="small-txt"> Loading Community ...</div>
            ) : (
              <div className="small-txt"> Loading Community ...</div>
            )}

            {/* onClick={()=>fetchFeedByTag(item)} */}

            {topics && (
              <>
                <h4>Topics</h4>
                <ul className="hash-tag-list">
                  {tagsLoaded === true && topics && topics.length > 0 ? (
                    topics.map((item, index) => {
                      return (
                        <li key={index}>
                          {" "}
                          <button onClick={() => fetchFeedByTag(item)}>
                            #
                            {displayName(
                              item,
                              item
                                .toLowerCase()
                                .search(searchTxt.toLowerCase()),
                              searchTxt.length + item.search(searchTxt)
                            )}
                          </button>
                        </li>
                      );
                    })
                  ) : tagsLoaded === true && topics && topics.length == 0 ? (
                    <li>No Topics Found</li>
                  ) : tagsLoaded === "Loading" ? (
                    <li>Loading Topics ...</li>
                  ) : (
                    ""
                  )}
                </ul>
              </>
            )}

            <button
              disabled={searchTxt.length === 0}
              onClick={(e) => showSearchPage(e)}
              className="common-community-btn"
            >
              See All Search Results
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBox;
