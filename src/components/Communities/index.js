import React, { useEffect, useState } from "react";
import {
  getAllPublicCommunityList,
  joinCommunityAPI,
  joinCommunityEmail,
  getMyCommunityList,
  getUsersDetail,
  getCommunityDetail,
  getAllFeed,
  getFavoriteCommunityList,
} from "../../api/community";
import {
  fetchOrgFeeds,
  getAllCommunity,
  getTodaysCommunity,
} from "../../api/orgAdmin";
import { useSelector, useDispatch } from "react-redux";
import {
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  addMyCommunity,
  setCurrentCommunity,
  setFeeds,
  setCommunityId,
  setPage,
  setPost,
  setCommuinityHeaderTab,
  setFeedIdList,
} from "../../redux";
import { useCreateDefaultGroup } from '../chats/hooks/useCreateDefaultGroup';

function Communities() {
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const userId = useSelector((state) => state.info.userId);
  const page = useSelector((state) => state.info.page);
  const [communities, setCommunities] = useState([]);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const [mycommmunityLoading, setMycommmunityLoading] = useState(null);
  const dispatch = useDispatch();
  const count = useSelector((state) => state.feeds.perPageFeed);
  const { isLoading, mutateAsync } = useCreateDefaultGroup();

  useEffect(() => {
    let abortController = new AbortController();
    // eslint-disable-next-line default-case
    switch (page) {
      case "suggestedCommunities":
        getCommunityList();
        break;
      case "myCommunities":
        queryMyCommunity();
        break;
      case "favoriteCommunities":
        queryFavoriteCommunityList();
        break;
      case "allCommunities":
        queryAllCommunity(false);
        break;
      case "deletedCommunities":
        queryAllCommunity(true);
        break;
      case "todaysCommunities":
        todaysCommunityList();
        break;
    }

    return () => {
      abortController.abort();
    };
  }, [page]);
  const queryAllCommunity = async (deleted) => {
    try {
      let payload = {
        token,
        appId,
        deleted,
      };
      dispatch(setMessageBox(true));
      if (!deleted) {
        dispatch(setMessageTxt("Loading All Communities"));
      } else {
        dispatch(setMessageTxt("Loading Deleted Communities"));
      }

      dispatch(setMessageBoxCloseBtn(false));

      // console.log(payload);
      await getAllCommunity(payload)
        .then((res) => {
          console.log(res);
          setCommunities(res);
          // attachUserDetail(res);
          dispatch(setMessageBox(false));
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };
  const todaysCommunityList = async () => {
    try {
      let date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      // const currentDate = date.toLocaleDateString();
      const currentDate = year + "-" + month + "-" + day;

      let payload = {
        currentDate,
        deleted: false,
      };
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Loading Todays Communities"));
      dispatch(setMessageBoxCloseBtn(false));
      await getTodaysCommunity(payload)
        .then((res) => {
          if (res && res.status && res.status === 200) {
            attachUserDetail(res.data.data);
            dispatch(setMessageBox(false));
          } else {
            console.log("Something error on queryFavoriteCommunityList");
            dispatch(setMessageBox(false));
          }
          // dispatch(setFavorite(res));
        })
        .catch((error) => {
          console.log("Error on getFavoriteCommunityList", error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const setCommunity = (item) => {
    if (
      item.isMember === false ||
      page === "suggestedCommunities" ||
      page === "deletedCommunities"
    ) {
      return false;
    }

    dispatch(setCurrentCommunity({}));
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Loading feeds ..."));

    mutateAsync({
      token,
      appId,
      communityId: item._id,
    }).then((res) => {
      getCommunityDetail({
        communityId: item._id,
        appId,
        token,
      })
        .then(async (response) => {
          if (response && response.status && response.status === 200) {
            dispatch(setCommunityId(item._id));
            const communityUsersWithDetail = await getUsersDetail({
              token,
              userIds: response.data.data.communityUsers,
            }).then((res) => res.data.data);

            dispatch(
              setCurrentCommunity({
                ...response.data.data,
                communityUsers: communityUsersWithDetail,
                defaultGroup: res?.data?.data,
              })
            );
            dispatch(setPage("eachcommunity"));
            dispatch(setPost(""));
            dispatch(setCommuinityHeaderTab());
            if (userRole === "user") {
              // dispatch(setLoading("Loading all feeds ..."));
              getAllFeed({
                communityId: item._id,
                count,
                appId,
                token,
              }).then((response) => {
                if (response && response.list && Array.isArray(response.list)) {
                  dispatch(setFeeds(response.list));
                  dispatch(
                    setFeedIdList(response.list.map((item) => item._id))
                  );
                }

                window.scrollTo(0, 0);
                //  dispatch(setLoading(false));
              });
            } else if (userRole === "admin") {
              // dispatch(setLoading("Loading all feeds ..."));
              fetchOrgFeeds({
                communityId: item._id,
                token,
                appId,
              }).then((response) => {
                dispatch(setFeeds(response.list));
                dispatch(setFeedIdList(response.list.map((item) => item._id)));
                window.scrollTo(0, 0);
                // dispatch(setLoading(false));
              });
            }
            dispatch(setMessageBox(false));
          } else {
            console.error("Error :", response);
            dispatch(setMessageTxt("Something went wrong"));
            dispatch(setMessageBoxCloseBtn(true));
          }
        })
        .catch((error) => {
          console.log("Error on getCommunityDetail", error);
          dispatch(setMessageBox(false));
        });
    });
  };

  async function getCommunityList() {
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Loading All Public Communities"));
    dispatch(setMessageBoxCloseBtn(false));
    await getAllPublicCommunityList({
      appId,
      token,
    })
      .then((res) => {
        if (res) {
          setCommunities(res);
          dispatch(setMessageBox(false));
        }
      })
      .catch((error) => {
        console.log("Error on Public CommunityList", error);
        dispatch(setMessageBox(false));
      });
  }
  const queryFavoriteCommunityList = async (payload) => {
    try {
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Loading All Favorite Communities"));
      dispatch(setMessageBoxCloseBtn(false));
      let payload = {
        appId,
        token,
      };
      await getFavoriteCommunityList(payload)
        .then((res) => {
          if (res && res.status && res.status === 200) {
            attachUserDetail(res.data.data);
          } else {
            dispatch(setMessageBox(false));
          }
          // dispatch(setFavorite(res));
        })
        .catch((error) => {
          console.log("Error on getFavoriteCommunityList", error);
          dispatch(setMessageBox(false));
        });
    } catch (error) {
      console.error(error);
    }
  };
  const attachUserDetail = (res) => {
    let users = [];
    if (page === "favoriteCommunities") {
      res.forEach((item) => {
        if (item && item.usersArray && item.usersArray.length > 0) {
          users = [...users, ...item.usersArray];
        }
      });
    } else {
      res.forEach((item) => {
        if (item && item.communityUsers && item.communityUsers.length > 0) {
          users = [...users, ...item.communityUsers];
        }
      });
    }

    let usersSets = new Set(users);

    let uniqueUsers = Array.from(usersSets);
    console.log(uniqueUsers);
    uniqueUsers = uniqueUsers.filter((item) => item.length >= 10);
    getUsersDetail({
      userIds: uniqueUsers,
      appId,
      token,
    }).then((response) => {
      console.log(response);
      let myCommunityDetail = res.map((item) => {
        let obj = {
          createdBy: item.createdBy,
          state: item.state,
          description: item.description,
        };
        if (page === "favoriteCommunities") {
          obj._id = item.communityId;
          obj.name = item.communityName;
          obj.communityUsers = item.usersArray.map((userId) =>
            response.data.data.find((userDetail) => userDetail._id === userId)
          );
        } else {
          obj.name = item.name;
          obj._id = item._id;
          obj.communityUsers = item.communityUsers.map((userId) =>
            response.data.data.find((userDetail) => userDetail._id === userId)
          );
        }
        return obj;
      });
      console.log(myCommunityDetail);
      setCommunities(myCommunityDetail);
      dispatch(setMessageBox(false));
    });
  };
  const queryMyCommunity = async () => {
    try {
      let payload = {
        appId,
        token,
      };
      if (!mycommmunityLoading) {
        setMycommmunityLoading("loading");
        dispatch(setMessageBox(true));
        dispatch(setMessageTxt("Loading My Communities"));
        dispatch(setMessageBoxCloseBtn(false));
        await getMyCommunityList(payload)
          .then(async (res) => {
            setMycommmunityLoading(null);
            if (Array.isArray(res)) {
              attachUserDetail(res);
            }
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const joinCommunity = (item) => {
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Joining Community ...."));
    dispatch(setMessageBoxCloseBtn(false));
    joinCommunityAPI({
      communityId: item._id,
      appId,
      token,
    })
      .then((response) => {
        if (
          response &&
          response.data &&
          response.data.metadata &&
          response.data.metadata.statusCode === 200 &&
          response.data.metadata.message
        ) {
          let payload = {
            communityUserCount: item.communityUsers.length + 1,
            communityUsers: [...item.communityUsers, userId],
            name: item.name,
            state: item.state,
            _id: item._id,
          };
          dispatch(addMyCommunity(payload));

          setCommunities(
            [...communities].filter(
              (community) => community._id !== payload._id
            )
          );
          dispatch(setMessageTxt("Sending Email after joining community ..."));
          joinCommunityEmail({
            communityName: item.name,
            communityId: item._id,
            appId,
            token,
            type: "withPushNotification",
          })
            .then((emailResponse) => {
              if (emailResponse.status === 200) {
                dispatch(setMessageTxt("Successfully Joined Community"));
                dispatch(setMessageBoxCloseBtn(true));
                window.scrollTo(0, 0);
              } else {
                dispatch(
                  setMessageTxt(
                    "Having issue while sending email after joining community"
                  )
                );
                dispatch(setMessageBoxCloseBtn(true));
              }
            })
            .catch((error) => {
              dispatch(
                setMessageTxt(
                  "Having issue while sending email after joining community"
                )
              );
              dispatch(setMessageBoxCloseBtn(true));
              console.error(error);
            });
        } else {
          if (
            response &&
            response.data &&
            response.data.metadata &&
            response.data.metadata.message
          ) {
            dispatch(setMessageTxt(response.data.metadata.message));
          }
          dispatch(setMessageBoxCloseBtn(true));
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="search-results-header">
      <h2 className="mb-4">
        {page === "myCommunities"
          ? "My Communities"
          : page === "suggestedCommunities"
          ? "Public Communities"
          : page === "favoriteCommunities"
          ? "Favorite Communities"
          : page === "allCommunities"
          ? "All Communities"
          : page === "todaysCommunities"
          ? "Todays Communities"
          : page === "deletedCommunities"
          ? "Deleted Communities"
          : "All Communities"}
      </h2>

      <div className="row discover-list-holder pt-4">
        {communities &&
          communities.length > 0 &&
          communities.map((item) => {
            return (
              <div className="col-sm-4 col-lg-4 mb-4" key={item._id}>
                <div className={`communities-box ${page}`}>
                  <div
                    className="communities-intro-banner cursorPointer"
                    onClick={() => setCommunity(item)}
                  >
                    {!item.bannerImage ? (
                      <img
                        src={process.env.REACT_APP_SITE_URL + "morning.jpg"}
                        alt={item.name}
                        title={item.name}
                      />
                    ) : (
                      <img
                        src={item.bannerImage}
                        alt={item.name}
                        title={item.name}
                      />
                    )}
                    {userId === item.createdBy && (
                      <span className="star">
                        <img
                          onError={(error) => console.error(error)}
                          className="star"
                          src={
                            process.env.REACT_APP_SITE_URL + "white-star.png"
                          }
                        />
                      </span>
                    )}
                  </div>

                  <ul className="communities-members-list">
                    {item.communityUsers &&
                      item.communityUsers.length > 0 &&
                      item.communityUsers.map((user, index) => {
                        return (
                          index < 5 &&
                          typeof user === "object" && (
                            <li key={user._id}>
                              <img
                                src={
                                  user &&
                                  user?.profilePic &&
                                  typeof user.profilePic === "string"
                                    ? user.profilePic
                                    : process.env.REACT_APP_SITE_URL +
                                      "avatar0.svg"
                                }
                                title={user.firstName}
                              />
                            </li>
                          )
                        );
                      })}
                  </ul>
                  {/*  item.communityUsers &&  item.communityUsers.length>0 &&  typeof item.communityUsers[0] === "object" && item.communityUsers.map((user,index)=>{<li key={user._id}> <span>{user.profilePic}</span> </li>}) */}
                  <div className="communities-intro-members">
                    <div className="state ">
                      {item.state === "Public" && (
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL + "icon-globe.svg"
                          }
                        />
                      )}
                      {item.state === "Private" && (
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL +
                            "icon-lock-light.svg"
                          }
                        />
                      )}
                      <span> {item.state}</span>
                    </div>
                    <span
                      className="title cursorPointer"
                      onClick={() => setCommunity(item)}
                    >
                      {item.name}
                    </span>
                    <span
                      className="total-members cursorPointer"
                      onClick={() => setCommunity(item)}
                    >
                      {item.communityUsers.length} members
                    </span>
                    <p
                      className="cursorPointer cursorPointer"
                      onClick={() => setCommunity(item)}
                    >
                      {item.description}
                    </p>
                    {page === "suggestedCommunities" && (
                      <button
                        onClick={() => joinCommunity(item)}
                        title="Join Community"
                        alt="Join Community"
                        className="common-community-btn"
                      >
                        Join Community
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default React.memo(Communities);
