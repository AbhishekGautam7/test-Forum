import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrgFeeds } from "../../api/orgAdmin";
import {
  getUsersDetail,
  searchCommunityByKeyword,
  joinCommunityAPI,
  getCommunityDetail,
  getAllFeed,
  joinCommunityEmail,
} from "../../api/community";
import {
  setSearchCommunityList,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setSearchMemberList,
  setLoadSearchResult,
  addMyCommunity,
  setFeeds,
  setCurrentCommunity,
  setCommunityId,
  setPage,
  setPost,
  setCommuinityHeaderTab,
  setLoading,
  setFeedIdList,
  hasMoreFeed,
} from "../../redux";
import { useQueryClient } from "@tanstack/react-query";

function Communities() {
  const communityList = useSelector((state) => state.search.communityList);
  const info = useSelector((state) => state.info);
  const dispatch = useDispatch();
  const keyword = useSelector((state) => state.search.keyword);
  const tab = useSelector((state) => state.search.tab);
  const searchType = useSelector((state) => state.search.type);
  const userId = useSelector((state) => state.info.userId);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const queryClient = useQueryClient();

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
            communityUsers: [...item.communityUsers, info.userId],
            name: item.name,
            state: item.state,
            _id: item._id,
          };
          dispatch(addMyCommunity(payload));

          let cloneCommunityList = [...communityList];
          let comObj = cloneCommunityList.find(
            (community) => community._id === item._id
          );
          let comIndex = cloneCommunityList.indexOf(comObj);
          cloneCommunityList[comIndex].isMember = true;
          dispatch(setSearchCommunityList(cloneCommunityList));
          dispatch(setMessageTxt("Sending Email after joining community ..."));
          joinCommunityEmail({
            communityName: item.name,
            communityId: item._id,
            appId,
            token,
            type: "withPushNotification",
          })
            .then((emailResponse) => {
              if (
                emailResponse &&
                emailResponse.status &&
                emailResponse.status === 200
              ) {
                dispatch(setMessageTxt("Successfully Joined Community"));
                dispatch(setMessageBoxCloseBtn(true));
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
        queryClient.invalidateQueries("communityList");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    try {
      if (searchType === "private") {
        dispatch(setMessageBox(true));
        dispatch(setMessageTxt("Loading Communities ..."));

        searchCommunityByKeyword({
          keyword: keyword,
          appId,
          token,
        }).then((res) => {
          if (res && res.status && res.status === 200) {
            let resData = res.data.data;
            if (resData.length > 0) {
              let users = [];
              resData.map((item) =>
                item.communityUsers.forEach((user) => users.push(user))
              );
              console.log(users);
              console.log(Array.from(new Set(users)));
              dispatch(setMessageBoxCloseBtn(false));
              getUsersDetail({
                userIds: Array.from(new Set(users)),
                appId,
                token,
              }).then((response) => {
                if (
                  response &&
                  response.status &&
                  response.status === 200 &&
                  response.data &&
                  response.data.data
                ) {
                  let userList = response.data.data;

                  dispatch(setSearchMemberList(userList));
                  let communityUsers = resData.map((item) =>
                    item.communityUsers.map((user) =>
                      userList.find((obj) => obj._id === user)
                    )
                  );
                  let totalUsersData = resData.map((item, index) => {
                    let obj = { ...item };
                    obj.communityUsers = communityUsers[index];
                    return obj;
                  });

                  dispatch(setSearchCommunityList(totalUsersData));
                  dispatch(setMessageBox(false));
                  dispatch(setLoadSearchResult(false));
                } else {
                  dispatch(setSearchCommunityList([]));
                  dispatch(setMessageTxt("Something went wrong "));
                  dispatch(setMessageBoxCloseBtn(true));
                  dispatch(setLoadSearchResult(false));
                }
              });
            } else {
              dispatch(setSearchCommunityList([]));
              dispatch(setMessageBox(false));
              dispatch(setLoadSearchResult(false));
            }
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [tab, keyword, searchType]);

  const setCommunity = (item) => {
    if (item.isMember === false && userRole === "user") {
      return false;
    }
    dispatch(setFeeds([]));
    dispatch(setCurrentCommunity({}));
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Loading feeds ..."));
    getCommunityDetail({
      communityId: item._id,
      appId,
      token,
    })
      .then((response) => {
        if (response && response.status && response.status === 200) {
          dispatch(setCommunityId(item._id));
          dispatch(setCurrentCommunity(response.data.data));
          dispatch(setPage("eachcommunity"));
          dispatch(setPost(""));
          dispatch(setCommuinityHeaderTab());
          if (userRole === "user") {
            dispatch(setLoading("Loading all feeds ..."));
            getAllFeed({
              communityId: item._id,
              appId,
              token,
            }).then((response) => {
              dispatch(setFeeds(response.list));
              dispatch(setFeedIdList(response.list.map((item) => item._id)));
              dispatch(hasMoreFeed(response.metadata.hasMore));
              dispatch(setLoading(false));
            });
          } else if (userRole === "admin") {
            dispatch(setLoading("Loading all feeds ..."));
            fetchOrgFeeds({
              communityId: item._id,
              appId,
              token,
            }).then((response) => {
              dispatch(setFeeds(response.list));
              dispatch(setFeedIdList(response.list.map((item) => item._id)));
              dispatch(hasMoreFeed(response.metadata.hasMore));
              dispatch(setLoading(false));
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
        console.error("Error on getCommunityDetail", error);
        dispatch(setMessageBox(false));
      });
  };

  return (
    <div className="row discover-list-holder">
      {communityList && communityList.length === 0 && (
        <div>No Community Found </div>
      )}

      {communityList &&
        communityList.length > 0 &&
        communityList.map((item) => {
          return (
            <div className="col-sm-6 col-lg-6 mb-4" key={item._id}>
              <div className="linkBtn">
                <div className="communities-box">
                  <div
                    className="communities-intro-banner cursorPointer"
                    onClick={() => setCommunity(item)}
                  >
                    {item &&
                    item.bannerImage &&
                    item.bannerImage &&
                    item.name ? (
                      <img
                        src={item.bannerImage}
                        alt={item.name}
                        title={item.name}
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={process.env.REACT_APP_SITE_URL + "morning.jpg"}
                        alt="Morning"
                        title="Morning"
                      />
                    )}

                    {userId === item.createdBy && (
                      <span className="star">
                        <img
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
                      item.communityUsers.map((member, index) => {
                        return (
                          index < 5 &&
                          member &&
                          member._id && (
                            <li key={member._id}>
                              <img
                                src={
                                  member.profilePic
                                    ? member.profilePic
                                    : process.env.REACT_APP_SITE_URL +
                                      "avatar0.svg"
                                }
                                title={member.firstName}
                              />
                            </li>
                          )
                        );
                      })}
                  </ul>
                  <div className="communities-intro-members">
                    {item && item.state && (
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
                    )}
                    {item && item.name && (
                      <span
                        className="title cursorPointer"
                        onClick={() => setCommunity(item)}
                      >
                        {item.name}
                      </span>
                    )}
                    {item && item.communityUsers && (
                      <span
                        className="total-members cursorPointer"
                        onClick={() => setCommunity(item)}
                      >
                        {item.communityUsers.length} members
                      </span>
                    )}
                    {item && item.description && (
                      <p
                        className="cursorPointer cursorPointer"
                        onClick={() => setCommunity(item)}
                      >
                        {item.description}
                      </p>
                    )}

                    {item &&
                      item.isMember &&
                      userRole &&
                      item.isMember === false &&
                      userRole ===
                        "user"(
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
            </div>
          );
        })}
    </div>
  );
}

export default Communities;
