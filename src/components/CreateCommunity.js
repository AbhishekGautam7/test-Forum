import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import SelectUsers from "./modules/SelectUsers";

import {
  addAllCommunity,
  addMyCommunity,
  addTodaysCommunity,
  hasMoreFeed,
  setCommunityId,
  setCurrentCommunity,
  setFeedIdList,
  setFeeds,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setModal,
  setPage,
  setStatusCreateCommunity,
  setTotalFeed,
} from "../redux/";

import LoadingMessageBox from "./modules/LoadingMessageBox";

import Tag from "./modules/Tag";

import useChatStore from "../stores/chatStore";
import {
  addMemberToCommunity,
  createNewCommunity,
  getMemberList,
  userAddedToCommunityEmail,
} from "../api/community";

function CreateCommunity({ isMobile = false }) {
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
  const [buttonStatus, setButtonStatus] = useState(true);
  const userId = useSelector((state) => state.info.userId);
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.myProfile.data);

  const queryClient = useQueryClient();

  const {
    setIsCreateGroupFormOpen,
    setIsGroupDetailBoxOpen,
    setIsGroupSettingBoxOpen,
    setIsAddOrRemoveGroupMembersBoxOpen,
  } = useChatStore((store) => store);

  const resetAllState = () => {
    setIsCreateGroupFormOpen(false);
    setIsGroupDetailBoxOpen(false);
    setIsGroupSettingBoxOpen(false);
    setIsAddOrRemoveGroupMembersBoxOpen(false);
  };

  const sortingMember = (e) => {
    try {
      let payload = {
        name: e.target.value.trim(),
        token,
        appId,
      };

      if (payload && payload.name && payload.name.length > 0) {
        getMemberList(payload)
          .then((res) => {
            setMember(() => res.filter((item) => item.id !== userId));
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const createCommunity = async () => {
    const payload = {
      name,
      description,
      members: selectedMembers,
      isPrivate: isPrivate,
      tagNames: tags.join(","),
      appId,
      token,
    };
    dispatch(setStatusCreateCommunity(false));
    dispatch(setModal(false));
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Creating Community ..."));
    dispatch(setMessageBoxCloseBtn(false));

    await createNewCommunity(payload)
      .then((res) => {
        console.log(res);
        let responseData = res.data.data;
        let dispatchList = [];
        if (res.status === 200) {
          let obj = {
            communityId: responseData._id ? responseData._id : 0,
            userIds:
              selectedMembers && selectedMembers.length > 0
                ? selectedMembers.map((item) => item.id)
                : [],
            addedBy: userId ? userId : null,
            isPrivate: isPrivate,
            tagNames: tags.join(","),
            userId,
            communityUsers: selectedMembers,
          };

          /* Making Ready Object to reflect on UI while creating community */
          let data = {
            _id: obj.communityId,
            name: name,
            userId,
            communityUsers: [
              ...selectedMembers,
              {
                id: myProfile?._id,
                name: myProfile?.firstName + " " + myProfile?.lastName,
                img: myProfile?.profilePic,
                role: myProfile?.role,
                email: myProfile?.email,
              },
            ],
            createdBy: userId,
            description: description,
            tagNames: tags,
            state: isPrivate ? "Private" : "Public",
          };

          if (userRole === "user") {
            dispatchList.push(dispatch(addMyCommunity(data)));
          }

          console.log("dataAfterCreateCommunity", data);
          dispatchList.push(dispatch(setCommunityId(data._id)));
          data.state = isPrivate ? "Private" : "Public";
          dispatchList.push(dispatch(setCurrentCommunity(data)));
          if (userRole === "admin") {
            console.log("Adding on all Community", data);
            dispatchList.push(dispatch(addAllCommunity(data)));
            dispatchList.push(dispatch(addTodaysCommunity(data)));
          }
          dispatchList.push(dispatch(setFeeds([])));
          dispatchList.push(dispatch(setPage("eachcommunity")));
          dispatchList.push(dispatch(setFeedIdList([])));
          dispatchList.push(dispatch(hasMoreFeed(false)));
          dispatchList.push(dispatch(setTotalFeed(0)));

          /* If user is available need to add those member into community otherwise send sucess message */

          if (obj.userIds.length > 0) {
            console.log("Go Users");
            let memberPayload = {
              communityId: obj.communityId,
              userIds: obj.communityUsers,
              appId,
              token,
            };
            dispatch(setMessageTxt("Adding Members to Community ..."));

            /* Adding Users to the Community */
            addMemberToCommunity(memberPayload)
              .then((res) => {
                console.log(res);
                dispatch(
                  setMessageTxt("Sending email to community users ... ")
                );
                if (res.status === 200) {
                  /* If user is added to the community need to send emails */
                  let userIdsOnly =
                    selectedMembers &&
                    selectedMembers.map((user) => (user._id ? user._id : user));
                  userAddedToCommunityEmail({
                    userIds: userIdsOnly,
                    communityName: name,
                    communityId: obj?.communityId,
                    token,
                    appId,
                    type: "withPushNotification",
                  })
                    .then((emailRes) => {
                      console.log(emailRes);
                      /* Update UI with the result */
                      if (emailRes.status === 200) {
                        Promise.allSettled(dispatchList).then((res) =>
                          console.log("All  dispatched ", res)
                        );
                        dispatch(
                          setMessageTxt("Sucessfully Created Community")
                        );
                        dispatch(setMessageBoxCloseBtn(true));

                        queryClient.invalidateQueries("communityList");
                      } else {
                        dispatch(
                          setMessageTxt(
                            "Something went wrong while sending email to community users."
                          )
                        );
                        dispatch(setMessageBoxCloseBtn(true));
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            /* Update UI with the result */
            Promise.allSettled(dispatchList).then((res) =>
              console.log("All  dispatched ", res)
            );
            dispatch(setMessageTxt("Sucessfully Created Community"));

            dispatch(setMessageBoxCloseBtn(true));

            queryClient.invalidateQueries("communityList");
          }
        } else {
          dispatch(
            setMessageTxt("Something went wrong while creating community.")
          );
          dispatch(setMessageBoxCloseBtn(true));
        }
      })
      .catch((error) => console.error(error));

    resetAllState();
  };
  const closeMe = () => {
    try {
      dispatch(setStatusCreateCommunity(false));
      dispatch(setModal(false));
    } catch (error) {
      console.error(error);
    }
  };
  const isValidateForm = name && name.length > 0 ? true : false;
  const closeModal = () => {
    try {
      dispatch(setStatusCreateCommunity(false));
      dispatch(setModal(false));
    } catch (error) {
      console.error(error);
    }
  };

  const getSelectedMember = (membs) => {
    try {
      let selectedMem = [];
      membs.map((item) => selectedMem.push(item));
      setSelectedMember(selectedMem);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      let abortController = new AbortController();
      // Get all Member List
      async function fetchMemberList() {
        getMemberList({ token, appId })
          .then((res) => {
            console.log(res);
            if (res && res.length > 0) {
              setMember(() => res.filter((item) => item._id !== userId));
            } else {
              console.error("Something went wrong");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      fetchMemberList();

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
  return (
    <div
      className="modal common-community-modal show createCommunity "
      id="mmunityModal"
      tabIndex="-1"
      aria-labelledby="mmunityModalLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div className="modal-dialog mt-0  create-modal-dialog">
        <div
          className="modal-content"
          style={{
            height: isMobile ? "98vh" : "",

            justifyContent: isMobile ? "center" : "",
          }}
        >
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

              <form action="#">
                <h5 className="modal-title" id="mmunityModalLabel">
                  Create Community :
                </h5>
                <div className="line"></div>
                <div
                  style={{
                    maxHeight: "60vh",
                    overflowY: "auto",
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="communityName" className="form-label">
                      Community Name <span>*</span>
                    </label>
                    <input
                      maxLength="40"
                      type="text"
                      className="form-control"
                      id="communityName"
                      placeholder="Morning Vibes"
                      aria-label="Morning Vibes"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete={"off"}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="communityDescription"
                      className="form-label"
                    >
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
                    {
                      <SelectUsers
                        exclude={userId}
                        members={JSON.stringify(members)}
                        onSelected={(users) => getSelectedMember(users)}
                        onSortingMember={(e) => sortingMember(e)}
                      />
                    }
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
                    <div className="form-text  ">
                      Seperate keywords with comma.
                    </div>
                  </div>

                  <div className="make-private-holder">
                    <div className="make-private-info">
                      <div className="img-wrap">
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL +
                            "icon-lock-light.svg"
                          }
                          alt="make private"
                          loading="lazy"
                        />
                        <span>Make Private</span>
                      </div>
                      <p>
                        When a community is set to private.It can only be viewed
                        or joined by invitation
                      </p>
                    </div>

                    <label className="common-switch">
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
                </div>

                <button
                  type="button"
                  className="common-community-btn"
                  disabled={!isValidateForm}
                  onClick={createCommunity}
                >
                  Create Community
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CreateCommunity);
