import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  addMemberToCommunity,
  getMemberList,
  getUsersDetail,
  userAddedToCommunityEmail,
} from "../../api/community";
import { addMemberToCommunityByAdmin } from "../../api/orgAdmin";
import {
  setAllCommunity,
  setCommunityUsers,
  setFavorite,
  setInviteUsersStatus,
  setMyCommunity,
  setTodaysCommunity,
} from "../../redux";

function InviteUsers(props) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loadingInviteUsers, setLoadingInviteUsers] = useState(null);
  const communityId = useSelector((state) => state.currentCommunity.data._id);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const { oldmembers } = props;
  const [keywords, setKeywords] = useState("");
  const myCommunity = useSelector((state) => state.myCommunity.data);
  const favoriteCommunity = useSelector((state) => state.favorite.data);
  const allCommunity = useSelector((state) => state.allCommunity.data);
  const todaysCommunity = useSelector((state) => state.todaysCommunity.data);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const userRole = useSelector((state) => state.myProfile.data.role);
  useEffect(() => {
    setMembers(() => props.members);
  }, [props]);

  const togglePrivateStatus = (id) => {
    try {
      if (selected.length > 0) {
        if (selected.indexOf(id) >= 0) {
          // Remove from list
          let index = selected.indexOf(id);
          let cloneSelected = [...selected];
          cloneSelected.splice(index, 1);

          /* let cloneSelected = [...selected].slice(index, 1); */
          setSelected(cloneSelected);
        } else {
          setSelected(() => [...selected, id]);
        }
      } else {
        let arr = [];
        arr.push(id);
        setSelected(arr);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const searchWithKeywords = () => {
    try {
      let payload = {
        name: keywords,
        appId: appId,
        token: token,
      };

      if (!loading) {
        setLoading("loading");
        getMemberList(payload)
          .then((res) => {
            setMembers(() => res);
            setLoading(null);
          })
          .catch((error) => {
            setLoading(null);
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateOnFavoriteCommunity = () => {
    try {
      let obj = favoriteCommunity.find(
        (item) => item.communityId === communityId
      );
      if (obj) {
        let index = favoriteCommunity.indexOf(obj);
        obj.usersArray = [...obj.usersArray, ...selected];
        let cloneFavoriteCommunity = [...favoriteCommunity];
        cloneFavoriteCommunity[index] = obj;
        dispatch(setFavorite(cloneFavoriteCommunity));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateOnMyCommunity = () => {
    try {
      let obj = myCommunity.find((item) => item._id === communityId);
      let index = myCommunity.indexOf(obj);
      obj.communityUsers = [...obj.communityUsers, ...selected];

      let cloneMyCommunity = [...myCommunity];
      cloneMyCommunity[index] = obj;
      dispatch(setMyCommunity(cloneMyCommunity));
    } catch (error) {
      console.error(error);
    }
  };

  const updateOnAllCommunity = () => {
    try {
      console.log(currentCommunity);
      let obj = allCommunity.find((item) => item._id === communityId);
      let index = allCommunity.indexOf(obj);
      obj.communityUsers = [...obj.communityUsers, ...selected];
      console.log(obj);
      let cloneMyCommunity = [...allCommunity];
      cloneMyCommunity[index] = obj;
      console.log(cloneMyCommunity[index]);
      console.log(cloneMyCommunity);
      dispatch(setAllCommunity(cloneMyCommunity));
    } catch (error) {
      console.error(error);
    }
  };

  const updateOnTodaysCommunity = () => {
    try {
      console.log(communityId);
      console.log(todaysCommunity);
      let obj = todaysCommunity.find((item) => item._id === communityId);
      console.log(obj);
      if (obj) {
        let index = todaysCommunity.indexOf(obj);
        obj.communityUsers = [...obj.communityUsers, ...selected];
        let cloneFavoriteCommunity = [...todaysCommunity];
        cloneFavoriteCommunity[index] = obj;
        console.log(cloneFavoriteCommunity);
        dispatch(setTodaysCommunity(cloneFavoriteCommunity));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const sendEmailToUsers = (response) => {
    try {
      userAddedToCommunityEmail({
        userIds: [...selected],
        communityName: currentCommunity.name,
        communityId: currentCommunity?._id,
        appId: appId,
        token: token,
        type: "withPushNotification",
      })
        .then((emailResponse) => {
          if (
            emailResponse.status === 200 &&
            emailResponse.data &&
            emailResponse.data.data
          ) {
            props.onMessage({
              msg: response.data.metadata.message,
              selected: selected,
            });
          } else {
            props.onMessage({
              msg: "Something went wrong while sending email",
              selected: selected,
            });
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };
  const inviteUsers = () => {
    try {
      if (!loadingInviteUsers) {
        setLoadingInviteUsers("Inviting Users ...");
        let payload = {
          communityId: communityId,
          userIds: selected,
          appId: appId,
          token: token,
        };
        console.log("selelected", selected);
        getUsersDetail({
          userIds: selected,
          appId,
          token,
        }).then((response) => {
          if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.length > 0
          ) {
            dispatch(
              setCommunityUsers(
                currentCommunity.communityUsers.concat(
                  response.data.data.map((item) => {
                    return {
                      id: item._id,
                      name: item.firstName + " " + item.lastName,
                      img: item.profilePic,
                      ...item,
                    };
                  })
                )
              )
            );
          }
        });
        if (userRole === "user") {
          addMemberToCommunity(payload)
            .then((response) => {
              if (response && response.status && response.status === 200) {
                console.log(
                  "addMemberToCommunity",
                  currentCommunity.communityUsers.concat(selected)
                );

                updateOnMyCommunity();
                updateOnFavoriteCommunity();

                if (selected.length > 0) {
                  sendEmailToUsers(response);
                }
              }

              if (
                response &&
                response.data &&
                response.data.metadata &&
                response.data.metadata.message &&
                response.status === 422
              ) {
              } else {
                props.onMessage({
                  msg: response.data.metadata.message,
                  selected: selected,
                });
              }

              setLoadingInviteUsers(null);
            })
            .catch((error) => {
              console.log(error);
              dispatch(setInviteUsersStatus(false));
            });
        } else if (userRole === "admin") {
          addMemberToCommunityByAdmin(payload)
            .then((response) => {
              if (response && response.status && response.status === 200) {
                updateOnAllCommunity();
                updateOnTodaysCommunity();
                props.onMessage({
                  msg: response.data.metadata.message,
                  selected: selected,
                });
                if (selected.length > 0) {
                  sendEmailToUsers(response);
                }
              }
              if (
                response &&
                response.data &&
                response.data.metadata &&
                response.data.metadata.message &&
                response.status === 422
              ) {
                props.onMessage({
                  msg: response.data.metadata.message,
                  selected: selected,
                });
              }
              setLoadingInviteUsers(null);
            })
            .catch((error) => {
              console.log(error);
              dispatch(setInviteUsersStatus(false));
            });
        }
        queryClient.invalidateQueries("communityList");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const setAllMembers = () => {
    try {
      setSelected(() =>
        members
          .filter((item) => {
            if (oldmembers.indexOf(item._id) < 0) {
              return item;
            }
          })
          .map((item) => item._id)
      );
    } catch (error) {
      console.error(error);
    }
  };
  const isOldUser = (id) => {
    try {
      if (oldmembers && oldmembers.length > 0) {
        return oldmembers.indexOf(id) >= 0;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeModalBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setInviteUsersStatus(false));
  };
  const workit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <>
      <div
        className="modal fade show common-community-modal"
        id="inviteModal"
        tabIndex="-1"
        aria-labelledby="inviteModalLabel"
        aria-hidden="true"
        style={{ display: "block" }}
        onClick={(e) => closeModalBox(e)}
      >
        <div
          className="modal-dialog add-information-dialog"
          onClick={(e) => workit(e)}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => dispatch(setInviteUsersStatus(false))}
              ></button>
            </div>

            <h5 className="modal-title" id="inviteModalLabel">
              Invite people to this community
            </h5>
            {members && members.length > 0 && <></>}
            <span className="all-members">
              Invite existing team members or add new ones
            </span>

            <div className="mb-3">
              <div className="searchBar d-flex">
                <input
                  type="text"
                  className="form-control members-search-control"
                  id="peopleSearch"
                  placeholder="Search a people by Name or EmailID"
                  aria-label="Search a people by Name or EmailID"
                  onKeyUp={(e) => setKeywords(e.target.value)}
                />
                <button
                  className="common-btn"
                  onClick={() => searchWithKeywords()}
                >
                  {loading ? "Loading Users ..." : "Search"}
                </button>
              </div>
              <div className="select-people-wrap">
                <button className="selected">
                  Selected({selected.length})
                </button>
                {members && members.length > 0 && (
                  <button
                    className="select-all"
                    onClick={() => setAllMembers()}
                  >
                    Select All
                  </button>
                )}
              </div>
            </div>

            <ul className="members-listing invite-listing">
              {members &&
                members.length > 0 &&
                members.map((user) => {
                  return (
                    <li
                      className={
                        isOldUser(user._id) ? `active older` : `active new`
                      }
                      key={user._id}
                      onClick={() => togglePrivateStatus(user._id)}
                    >
                      <div className="userInfo">
                        <div
                          className="img-wrap"
                          style={{ background: "none" }}
                        >
                          <img
                            src={
                              user && user.img
                                ? user.img
                                : process.env.REACT_APP_SITE_URL + "avatar0.svg"
                            }
                            alt="img"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-wrap">
                          <h4>{user.name ? user.name : ""}</h4>
                          <span>{user.email ? user.email : ""}</span>
                        </div>
                      </div>
                      <button className="invite-icon">
                        <img
                          src={
                            selected.indexOf(user._id) >= 0 ||
                            isOldUser(user._id) === true
                              ? process.env.REACT_APP_SITE_URL +
                                "icon-check-round.svg"
                              : process.env.REACT_APP_SITE_URL +
                                "icon-add-round.svg"
                          }
                          alt="icon"
                        />
                      </button>
                    </li>
                  );
                })}
            </ul>
            <div className="modal-btn-footer">
              <button
                className="common-community-btn"
                onClick={() => inviteUsers()}
                disabled={selected.length === 0}
              >
                Invite
              </button>
              <button
                className="common-btn"
                onClick={() => dispatch(setInviteUsersStatus(false))}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default React.memo(InviteUsers);
