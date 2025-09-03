import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectUsers from "./modules/SelectUsers";

import {
  setModal,
  setEditCommunityStatus,
  setCurrentCommunity,
  setFavorite,
  changeStateMyCommunity,
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  changeStateTodaysCommunity,
  setTodaysCommunity,
  setAllCommunity,
} from "../redux/";
import LoadingMessageBox from "./modules/LoadingMessageBox";
import Tag from "./modules/Tag";

import {
  getMemberList,
  editCommunity,
  editMembersToCommunity,
  getCommunityDetail,
  getUsersDetail,
  userAddedToCommunityEmail,
} from "../api/community";
import {
  editCommunityByAdmin,
  editCommunityUserByAdmin,
} from "../api/orgAdmin";

function EditCommunity() {
  /* Propsp from State */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMember] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMember] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [tagNames, setTagNames] = useState("");
  const [tags, setTags] = useState([]);
  const [id, setId] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [logo, setLogo] = useState("");
  const [buttonStatus, setButtonStatus] = useState(true);
  const [bannerImage, setBannerImage] = useState("");
  const [isUserLoaded, setUserLoaded] = useState(false);
  const info = useSelector((state) => state.info);

  const orgId = useSelector((state) => state.info.orgId);
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const myCommunity = useSelector((state) => state.myCommunity);
  const communityId = useSelector((state) => state.info.communityId);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const favorite = useSelector((state) => state.favorite.data);
  const [isValidateForm, setIsValidateForm] = useState(false);
  const todaysCommunity = useSelector((state) => state.todaysCommunity.data);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const allCommunity = useSelector((state) => state.allCommunity.data);
  const dispatch = useDispatch();

  const sortingMember = (e) => {
    try {
      let payload = {
        name: e.target.value,
        token,
        appId,
      };

      getMemberList(payload)
        .then((res) => {
          if (res && typeof res === "object" && res.length > 0) {
            setMember(() => res.filter((item) => item._id !== info.userId));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const sendEmailToNewUsers = () => {
    let users = [...selectedMembers];
    let communityUsers = currentCommunity.communityUsers;
    let index = users.indexOf(users.find((item) => item.id === info.userId));
    users.splice(index, 1);
    let newUsers = users.filter((item) => communityUsers.indexOf(item.id) < 0);
    console.log(newUsers);

    // Only send email if thee is new users
    if (newUsers.length > 0) {
      dispatch(setMessageTxt("Sending email to new community users ..."));
      userAddedToCommunityEmail({
        orgId: info.orgId,
        userIds: newUsers?.map((user) => user?._id),
        communityName: currentCommunity.name,
        communityId: currentCommunity?._id,
        token,
        appId,
        type: "withPushNotification",
      })
        .then((emailResponse) => {
          console.log(emailResponse);
          if (
            emailResponse.status === 200 &&
            emailResponse.data &&
            emailResponse.data.data
          ) {
            dispatch(setMessageTxt("Sucessfully edited community ..."));
            dispatch(setMessageBoxCloseBtn(true));
          } else {
            dispatch(setMessageTxt("Something went wrong while sending email"));
            dispatch(setMessageBoxCloseBtn(true));
          }
        })
        .catch((error) => console.error(error));
    } else {
      dispatch(setMessageTxt("Sucessfully edited community ..."));
      dispatch(setMessageBoxCloseBtn(true));
    }
  };
  console.log("selectedMembers", selectedMembers);
  const updateCurrentCommunity = (cloneCommunity) => {
    cloneCommunity.communityUsers = selectedMembers ? selectedMembers : [];
    cloneCommunity.communityUserCount = selectedMembers
      ? selectedMembers.length
      : 0;
    cloneCommunity.state = isPrivate ? "Private" : "Public";
    cloneCommunity.name = name;
    cloneCommunity.description = description;
    cloneCommunity.tagNames = tags;

    dispatch(setCurrentCommunity(cloneCommunity));
  };

  const updateTodaysCommunity = () => {
    let cloneTodaysCommunity = [...todaysCommunity];
    if (cloneTodaysCommunity.length > 0) {
      console.log(cloneTodaysCommunity);
      let mycommunities = cloneTodaysCommunity.filter(
        (item) => item._id === communityId
      );
      console.log(mycommunities);
      if (mycommunities.length > 0) {
        let obj = mycommunities[0];
        let indexObj = cloneTodaysCommunity.indexOf(obj);
        console.log(obj);
        obj.name = name;
        obj.communityUsers = selectedMembers
          ? selectedMembers.map((item) => item.id)
          : [];
        obj.communityUserCount = selectedMembers ? selectedMembers.length : 0;
        cloneTodaysCommunity[indexObj] = obj;

        console.log(cloneTodaysCommunity);
        dispatch(setTodaysCommunity(cloneTodaysCommunity));
      }
    }
  };
  const updateAllCommunity = () => {
    let cloneAllCommunity = [...allCommunity];
    if (cloneAllCommunity.length > 0) {
      let obj = cloneAllCommunity.find((item) => item._id === communityId);

      let indexObj = cloneAllCommunity.indexOf(obj);

      obj.name = name;
      obj.communityUsers = selectedMembers
        ? selectedMembers.map((item) => item.id)
        : [];
      obj.communityUserCount = selectedMembers ? selectedMembers.length : 0;
      cloneAllCommunity[indexObj] = obj;

      console.log(cloneAllCommunity);
      dispatch(setAllCommunity(cloneAllCommunity));
    }
  };
  const hitEditAPI = (payload) => {
    try {
      if (userRole === "user") {
        console.log("I am user", userRole);
        editCommunity(payload).then((res) => {
          if (res.status === 200) {
            let cloneCommunity = { ...currentCommunity };
            // Update on currentCommunity
            updateCurrentCommunity(cloneCommunity);

            // Update on mycommunity
            let cloneMyCommunity = [...myCommunity.data];
            let obj = cloneMyCommunity.find((item) => item._id === id);

            let indexObj = cloneMyCommunity.indexOf(obj);

            obj.name = name;
            obj.description = description;
            obj.communityUsers = selectedMembers
              ? selectedMembers.map((item) => item.id)
              : [];
            obj.communityUserCount = selectedMembers
              ? selectedMembers.length
              : 0;
            cloneMyCommunity[indexObj] = obj;

            // Update on MyCommunities
            dispatch(
              changeStateMyCommunity({
                state: isPrivate ? "Private" : "Public",
                communityId: communityId,
              })
            );

            if (cloneCommunity.isFavourite) {
              let cloneFavorite = [...favorite];
              let favObj = cloneFavorite.find(
                (item) => item.communityId === id
              );
              let indexFavObj = cloneFavorite.indexOf(favObj);
              favObj.communityName = name;
              favObj.userCount = obj.communityUserCount;
              favObj.usersArray = obj.communityUsers;
              favObj.state = isPrivate ? "Private" : "Public";
              cloneFavorite[indexFavObj] = favObj;

              dispatch(setFavorite(cloneFavorite));
            }

            sendEmailToNewUsers();
          } else {
            setLoadingText("Something wend wrong while editing Community data");
            setButtonStatus(true);
          }
        });
      } else if (userRole === "admin") {
        console.log("editCommunityByAdmin", selectedMembers);
        editCommunityByAdmin(payload).then((res) => {
          console.log(res);
          if (res.status === 200) {
            setLoadingText(res.data.metadata.message);
            setButtonStatus(true);
            // Update on currentCommunity
            let cloneCommunity = { ...currentCommunity };

            updateCurrentCommunity(cloneCommunity);

            // Update on All Communities
            if (
              allCommunity &&
              allCommunity.length > 0 &&
              allCommunity.filter((item) => item._id === communityId).length > 0
            ) {
              // Changin State
              dispatch(
                setAllCommunity({
                  state: isPrivate ? "Private" : "Public",
                  communityId: communityId,
                  communityUsers: selectedMembers.map((item) => item.id),
                })
              );
              // Changing community name, usercount
              updateAllCommunity();
            }

            // Update on Today's Communities
            if (
              todaysCommunity &&
              todaysCommunity.length > 0 &&
              todaysCommunity.filter((item) => item._id === communityId)
                .length > 0
            ) {
              // Changing State
              dispatch(
                changeStateTodaysCommunity({
                  state: isPrivate ? "Private" : "Public",
                  communityId: communityId,
                  communityUsers: selectedMembers.map((item) => item.id),
                })
              );
              // Changing community name, usercount
              updateTodaysCommunity();
            }

            sendEmailToNewUsers();
          } else {
            setLoadingText("Something wend wrong while editing Community data");
            setButtonStatus(true);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const editOwnCommunity = async () => {
    try {
      const payload = {
        name: name,
        description: description,
        tagNames: tags,
        state: isPrivate ? "Private" : "Public",
        bannerImage: currentCommunity.bannerImage,
        members: selectedMembers,
        appId,
        communityId: id,
        token,
      };

      // Closing Edit Community Box
      dispatch(setEditCommunityStatus(false));
      dispatch(setModal(false));

      // Showing Message Box
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Editing Community ..."));
      dispatch(setMessageBoxCloseBtn(false));

      console.log("Users are assigned");
      console.log(isUserLoaded ? "isUserLoaded" : "noUsernot loaded");

      if (isUserLoaded) {
        if (userRole === "user") {
          console.log("I am user");
          console.log("Selected :", selectedMembers);
          editMembersToCommunity({
            communityId: id,
            userIds: selectedMembers.map((item) => item.id),
            token,
            appId,
          }).then((response) => {
            if (response.status === 200) {
              hitEditAPI(payload);
            } else {
              setLoadingText("Something went wrong while editing Community");
            }
          });
        } else if (userRole === "admin") {
          console.log("Selected :", selectedMembers);
          editCommunityUserByAdmin({
            communityId: id,
            userIds:
              selectedMembers && selectedMembers.length > 0
                ? selectedMembers.map((item) => item.id)
                : [],
            token,
            appId,
          }).then((response) => {
            if (response.status === 200) {
              // Hit next api
              hitEditAPI(payload);
            } else {
              setLoadingText("Something went wrong while editing Community");
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeMe = () => {
    try {
      dispatch(setEditCommunityStatus(false));
      dispatch(setModal(false));
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    try {
      dispatch(setEditCommunityStatus(false));
      dispatch(setModal(false));
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedMember = (membs) => {
    try {
      let selectedMem = [];
      membs.map((item) => selectedMem.push(item));

      setSelectedMember(membs);
    } catch (error) {
      console.error(error);
    }
  };
  const findAllUserDetails = (userIds) => {
    try {
      getUsersDetail({
        userIds: userIds,
        appId,
        token,
      }).then((response) => {
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setSelectedMember(
            response.data.data.map((item) => {
              return {
                id: item._id,
                name: item.firstName + " " + item.lastName,
                img: item.profilePic,
                ...item,
              };
            })
          );
          setUserLoaded(true);
          //setSelectedMember(response.data.data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setIsValidateForm(name && name.length > 0 && isUserLoaded === true);
  }, [name, isUserLoaded]);
  useEffect(() => {
    setName(currentCommunity.name);
    setDescription(currentCommunity.description);
    setSelectedMember(currentCommunity.communityUsers);
    setIsPrivate(currentCommunity.state === "Private");
    setIsFeatured(currentCommunity.isFeatured);
    setLogo(currentCommunity.logo);
    setBannerImage(currentCommunity.bannerImage);
    setId(currentCommunity._id);
    setTags(() => currentCommunity.tagNames);
  }, [currentCommunity]);
  useEffect(() => {
    try {
      let abortController = new AbortController();
      async function fetchUsersFromCommunityDetail() {
        getCommunityDetail({
          communityId: info.communityId,
          appId,
          token,
        })
          .then((response) => {
            if (response && response.status && response.status === 200) {
              console.log(response.data.data);
              // dispatch(setCurrentCommunity(response.data.data));
            } else {
              console.error("Error :", response);
            }
          })
          .then((res) => {
            findAllUserDetails(currentCommunity.communityUsers);
          })
          .catch((error) => console.log("Error on getCommunityDetail", error));
      }

      // Get all Member List
      async function fetchMemberList() {
        let payload = { orgId, appId, token };
        getMemberList(payload)
          .then((res) => {
            setMember(() => res);
          })
          .catch((error) => {
            console.error(error);
          });
      }

      let apifetch = [];
      apifetch.push(fetchUsersFromCommunityDetail());
      apifetch.push(fetchMemberList());

      Promise.allSettled(apifetch).then((results) => {
        results.forEach((result) => console.log(result.status));
      });

      return () => {
        abortController.abort();
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setMyTags = (e) => {
    try {
      setTagNames(e.target.value);
      let val = e.target.value;

      if (e.target.value.search(",") >= 0) {
        let tagsColl = [...tags];
        tagsColl.push(e.target.value.replace(",", ""));
        setTags(tagsColl);
        setTagNames("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeTag = (item) => {
    try {
      let myTags = [...tags];

      let index = myTags.indexOf(item);

      myTags.splice(index, 1);
      setTags(myTags);
    } catch (error) {
      console.error(error);
    }
  };
  const hideModalBox = () => {
    dispatch(setEditCommunityStatus(false));
    dispatch(setModal(false));
  };
  const closeModalBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setEditCommunityStatus(false));
    dispatch(setModal(false));
    console.log("Close Modal Box");
  };
  const workit = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const changeStatus = () => {
    console.log("changeStatus");
    setIsPrivate(!isPrivate);
  };
  return (
    <div
      className="modal common-community-modal show"
      id="editComm"
      tabIndex="-1"
      aria-labelledby="mmunityModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div
        className="modal-dialog create-modal-dialog"
        onClick={(e) => workit(e)}
      >
        <div className="modal-content">
          {loading && (
            <LoadingMessageBox
              title={loadingText}
              buttonStatus={buttonStatus}
              onStatus={() => closeMe(false)}
            />
          )}

          {!loading && (
            <>
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>

              <h5 className="modal-title" id="createCommunityModalLabel">
                Edit Community :
              </h5>

              <div className="line"></div>
              <div className="mb-3">
                <label htmlFor="communityName" className="form-label">
                  Community Name <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="communityName"
                  placeholder="Morning Vibes"
                  aria-label="Morning Vibes"
                  value={name}
                  maxLength="40"
                  onChange={(e) => setName(e.target.value)}
                  autoComplete={"off"}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="communityDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="communityDescription"
                  rows="5"
                  autoComplete={"off"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Whatever your feelings about motivation, there’s no denying the positive vibes you can feel after reading some good morning quotes to help lift you out of bed to take on the day."
                ></textarea>
                <div className="form-text d-none">35 characters left</div>
              </div>

              <div className="select-member-holder mb-3">
                <label htmlFor="membersSearch" className="form-label">
                  Members
                </label>

                {selectedMembers &&
                  selectedMembers.length > 0 &&
                  selectedMembers[0].hasOwnProperty("id") && (
                    <SelectUsers
                      selected={selectedMembers}
                      members={JSON.stringify(members)}
                      onSelected={(users) => getSelectedMember(users)}
                      onSortingMember={(e) => sortingMember(e)}
                      currentCommunity={currentCommunity}
                    />
                  )}
              </div>

              <div className="mb-3">
                <label htmlFor="communityName" className="form-label">
                  Tags Name
                </label>

                <Tag
                  tagNames={tagNames}
                  tags={tags}
                  onRemoveTag={(item) => removeTag(item)}
                  onSetMyTags={(e) => setMyTags(e)}
                />
              </div>

              <div className="make-private-holder">
                <div className="make-private-info">
                  <div className="img-wrap">
                    <img
                      src={
                        process.env.REACT_APP_SITE_URL + "icon-lock-light.svg"
                      }
                      alt="make private"
                      loading="lazy"
                    />
                    <span>Make Private</span>
                  </div>
                  <p>
                    When a community is set to private.It can only be viewed or
                    joined by invitation
                  </p>
                </div>

                <label className="common-switch" onClick={() => changeStatus()}>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(e.target.checked);
                    }}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <button
                type="button"
                className="common-community-btn"
                disabled={!isValidateForm}
                onClick={editOwnCommunity}
              >
                Edit Community
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(EditCommunity);
