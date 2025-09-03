import React, { useEffect, useState, useRef } from "react";
import CustomSelectBox from "./modules/CustomSelectBox";
import { useSelector, useDispatch } from "react-redux";
import TopicTag from "./modules/TopicTag";
import { getAllScheduedPosts, getPastFeeds } from "../api/schedule";
import { shortQuestionContent } from "../libary/global";
import { getStatus } from "../libary/global";
import {
  fileUploader,
  getUsersDetail,
  editDiscussionFeed,
  editQuestionFeed,
  deletePost,
  addDiscuss,
  addQuestion,
  getAllFeed,
  addUserOnFeedEmail,
  addUserOnScheduleFeedEmail,
  getFeedByTag,
  getCommunityFeedByKeyword,
  advanceSearchConversations,
} from "../api/community";
import {
  editDiscussionByAdmin,
  editQuestionByAdmin,
  fetchOrgFeeds,
  deletePostByAdmin,
} from "../api/orgAdmin";
import UserTag from "./modules/UserTag";
import {
  setMessageBox,
  setMessageTxt,
  setFeeds,
  setFeedUsers,
  setFeedMode,
  setPost,
  setCommuinityHeaderTab,
  setMessageBoxCloseBtn,
  setFeedIdList,
  hasMoreFeed,
  setTotalFeed,
  setFeedsName,
  setCommunityId,
} from "../redux";
import PostFooter from "./modules/PostFooter";
import Editor from "./modules/Editor";
import FilePanel from "./modules/FilePanel";
import StartEndDate from "./modules/StartEndDate";
import MultiSelectDropdown from "./modules/MultiSelectDropdown";
import { getLearningTopics } from "../api/myconnect";
import { debounce } from "../libary/debounce";

function EditFeed(props) {
  const { feedId } = props;
  /* React Hooks */
  const [originalCommunityId, setOriginalCommunityId] = useState(null);
  const [community, setCommunity] = useState("");
  const [description, setDescription] = useState("");
  const [oneTimedesc, setOneTimedesc] = useState("");
  const [originalMember, setOriginalMember] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topicNames, setTopicNames] = useState("");
  const [topics, setTopics] = useState([]);
  const [isTopic, setIsTopic] = useState(false);
  const [title, setTitle] = useState("");

  const [question, setQuestion] = useState("");
  const [members, setMembers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [initTaggedUsers, setInitTaggedUsers] = useState([]);
  const [fileFlag, setFileFlag] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isValidForm, setIsValidForm] = useState(true);
  const [isStartEndDate, setIsStartEndDate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(null);
  const [isValidDate, setIsValidDate] = useState(true);
  const [feedCommunityId, setFeedCommunityId] = useState([]);
  const [feedCommunityName, setFeedCommunityName] = useState("");
  const [communityList, setCommunityList] = useState([]);

  const [selectedValue, setSelectedValue] = useState([]);
  const [learningTopics, setLearningTopics] = useState([]);
  const [allLearningTopics, setAllLearningTopics] = useState([]);
  const [assignedLearningTopics, setAssignedLearningTopics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();

  /* Redux Info */
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const orgId = useSelector((state) => state.info.orgId);
  const userId = useSelector((state) => state.info.userId);
  const tag = useSelector((state) => state.info.tag);
  const page = useSelector((state) => state.info.page);
  const communityId = useSelector((state) => state.info.communityId);
  const secretKey = useSelector((state) => state.info.secretKey);
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );

  /* Redux : myCommunity */
  const myCommunity = useSelector((state) => state.myCommunity);

  /* Redux : currentCommunity */
  const currentCommunity = useSelector((state) => state.currentCommunity.data);

  /* Redux : Feeds */
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  const feedName = useSelector((state) => state.feeds.name);
  const count = useSelector((state) => state.feeds.perPageFeed);

  /* Redux : Search */
  const search = useSelector((state) => state.search);
  const searchType = useSelector((state) => state.search.type);
  const searchKeyword = useSelector((state) => state.search.keyword);
  const searchTo = useSelector((state) => state.search.to);
  const searchFrom = useSelector((state) => state.search.from);
  const searchCommunityId = useSelector((state) => state.search.communityId);

  /* Redux : MyProfile */
  const userRole = useSelector((state) => state.myProfile.data.role);

  /* Redux : AllCommunity */
  const allCommunity = useSelector((state) => state.allCommunity);

  const tagToUser = (item) => {
    setTaggedUsers(() => [...taggedUsers, item]);
  };

  const isScheduleFeed = () => {
    console.log(endDate);
    console.log(startDate);
    return endDate && startDate ? true : false;
  };
  const sendEmailToNewUsersForScheduleFeed = (res) => {
    try {
      let startdate = new Date(startDate);
      let yy = startdate.getFullYear();
      let mm = startdate.getMonth() + 1;
      let dd = startdate.getDate();
      let scheduleDate = mm + "/" + dd + "/" + yy;

      let initUsers = initTaggedUsers.map((item) => item._id);
      let newUsers = taggedUsers.map((item) => item._id);
      if (newUsers.length > 0) {
        addUserOnScheduleFeedEmail({
          userIds: newUsers,
          communityName: community.name,
          title: title || shortQuestionContent(question),
          scheduleDate: scheduleDate,
          communityId: community._id,
          communityFeedId: res?.data?.data?._id,
          appId,
          token,
          type: "withPushNotification",
        })
          .then((emailResponse) => {
            console.log(emailResponse);
            if (emailResponse.status === 200) {
              if (userRole === "user") {
                fetchFeeds();
              } else {
                getOrgFeeds();
              }
            } else {
              dispatch(
                setMessageTxt(
                  res.data.metadata.message +
                    "But could not send email to selected users"
                )
              );
              dispatch(setMessageBoxCloseBtn(true));
            }
          })
          .catch((error) => {
            dispatch(
              setMessageTxt(
                "Sorry, we are having issue on sending email to selected users"
              )
            );
            dispatch(setMessageBoxCloseBtn(true));
            console.error(error);
          });
      } else {
        if (userRole === "user") {
          fetchFeeds();
        } else {
          getOrgFeeds();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAndAddQuestion = (payload) => {
    /* Need to delted first and add post */
    console.log("deleteAndAddDiscussion", payload);

    deletePost(payload)
      .then((response) => {
        if (response.status === 200) {
          addQuestion(payload).then((res) => {
            if (res.status === 200) {
              sendEmailToUsers(payload.userIds);
            } else {
              dispatch(setMessageTxt(response.data.metadata.message));
            }
          });
        } else {
          console.error("Error response", response.data.metadata.message);
          dispatch(setMessageBox(true));
          dispatch(
            setMessageTxt("Something went wrong while editing discussion.")
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteAndAddDiscussion = (payload) => {
    console.log("deleteAndAddDiscussion", payload);
    deletePost(payload)
      .then((response) => {
        if (response.status === 200) {
          dispatch(setMessageBox(true));

          addDiscuss(payload).then((res) => {
            if (res.status === 200) {
              // Send Emai to the users and fetch feeds
              if (isScheduleFeed()) {
                sendEmailToNewUsersForScheduleFeed(res);
              } else {
                sendEmailToUsers(payload.userIds);
              }
            } else {
              dispatch(setMessageTxt(response.data.metadata.message));
            }
          });
        } else {
          console.error("Error response", response.data.metadata.message);
          dispatch(setMessageBox(true));
          dispatch(
            setMessageTxt("Something went wrong while editing discussion.")
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteAndAddQuestionByAdmin = (payload) => {
    deletePostByAdmin(payload)
      .then((response) => {
        if (response.status === 200) {
          dispatch(setMessageBox(true));

          addQuestion(payload).then((res) => {
            console.log("payload", payload);
            console.log("res", res);
            if (res.status === 200) {
              if (isScheduleFeed() === true) {
                sendEmailToNewUsersForScheduleFeed(res);
              } else {
                sendEmailToUsers(payload.userIds);
              }
              // addFeedPost(res.data.data);
            } else {
              dispatch(setMessageTxt(response.data.metadata.message));
            }
          });
        } else {
          console.error("Error response", response.data.metadata.message);
          dispatch(setMessageBox(true));
          dispatch(
            setMessageTxt("Something went wrong while editing discussion.")
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const deleteAndAddDiscussionByAdmin = (payload) => {
    deletePostByAdmin(payload)
      .then((response) => {
        if (response.status === 200) {
          dispatch(setMessageBox(true));

          addDiscuss(payload).then((res) => {
            console.log("payload", payload);
            console.log("res", res);
            if (res.status === 200) {
              //getOrgFeeds();
              if (isScheduleFeed() === true) {
                sendEmailToNewUsersForScheduleFeed(res);
              } else {
                sendEmailToUsers(payload.userIds);
              }
            } else {
              dispatch(setMessageTxt(response.data.metadata.message));
            }
          });
        } else {
          console.error("Error response", response.data.metadata.message);
          dispatch(setMessageBox(true));
          dispatch(
            setMessageTxt("Something went wrong while editing discussion.")
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const getPublicSearchKeywordFeeds = () => {
    console.log("getPublicSearchKeywordFeeds is underconstruction...");
    console.log(search);

    advanceSearchConversations({
      communityId: searchCommunityId,
      keyword: searchKeyword,
      from: searchFrom,
      to: searchTo,
      tab: "conversations",
      appId,
      token,
    }).then((res) => {
      dispatch(setFeeds(res.list));
      dispatch(setFeedIdList(res.list.map((item) => item._id)));
      dispatch(hasMoreFeed(res.metadata.hasMore));
      dispatch(setMessageBoxCloseBtn(true));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
    });
  };
  const getPrivatSearchKeywordFeeds = () => {
    getCommunityFeedByKeyword({
      keyword: searchKeyword,
      appId,
      token,
    }).then((response) => {
      dispatch(setFeeds(response.list));
      dispatch(setFeedIdList(response.list.map((item) => item._id)));
      dispatch(hasMoreFeed(response.metadata.hasMore));
      dispatch(setTotalFeed(response.metadata.totalCount));
      dispatch(setMessageBoxCloseBtn(true));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
    });
  };
  const getFeedsByTagSearch = () => {
    let payload = {
      keyword: tag,
      status: getStatus({
        userRole,
        page,
        feed,
        communityHeaderTab,
      }),
      token,
      appId,
    };
    if (communityId) {
      payload.communityId = communityId;
    }

    getFeedByTag(payload).then((response) => {
      console.log(response);
      if (response.length === 0) {
        dispatch(setFeeds([]));
        dispatch(setMessageBox(true));
        dispatch(setMessageBoxCloseBtn(true));
        dispatch(setMessageTxt("No Data Found"));
        window.scrollTo(0, 0);
      } else {
        dispatch(setFeeds(response.list));
        dispatch(setFeedIdList(response.list.map((item) => item._id)));
        dispatch(hasMoreFeed(response.metadata.hasMore));
        dispatch(setTotalFeed(response.metadata.total));
        dispatch(setMessageTxt(""));
        window.scrollTo(0, 0);
        dispatch(setMessageBoxCloseBtn(true));
        dispatch(
          setMessageTxt(
            feed.type === "Discussion"
              ? "Sucessfully Edited Discussion."
              : "Sucessfully Edited Question."
          )
        );
      }
    });
  };
  const getAllPublicFeeds = () => {
    getAllFeed({
      communityId,
      token,
      appId,
    }).then((feedResponse) => {
      console.log(feedResponse.list);
      dispatch(setFeeds(feedResponse.list));
      dispatch(setFeedIdList(feedResponse.list.map((item) => item._id)));
      dispatch(hasMoreFeed(feedResponse.metadata.hasMore));
      dispatch(setTotalFeed(feedResponse.metadata.total));
      dispatch(setMessageBoxCloseBtn(true));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
    });
  };
  const getAllFeedList = (msg) => {
    if (feedName === "tagsearch") {
      getFeedsByTagSearch();
    } else if (page === "search") {
      if (searchType === "public") {
        getPublicSearchKeywordFeeds();
      } else if (searchType === "private") {
        getPrivatSearchKeywordFeeds();
      }
    } else {
      getAllPublicFeeds();
    }
  };
  // Fetch Orgnization Feed of all or particular community's conversation . If communityId found then it is related with
  const fetchOrgAllFeeds = () => {
    fetchOrgFeeds({
      communityId,
      token,
      appId,
    }).then((feedResponse) => {
      dispatch(setFeeds(feedResponse.list));
      dispatch(setFeedIdList(feedResponse.list.map((item) => item._id)));
      dispatch(hasMoreFeed(feedResponse.metadata.hasMore));
      dispatch(setTotalFeed(feedResponse.metadata.total));
      dispatch(setMessageBox(true));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
      dispatch(setMessageBoxCloseBtn(true));
    });
  };
  const fetchAdvanceSearchConversation = () => {
    advanceSearchConversations({
      keyword: searchKeyword,
      count,
      status: "all",
      appId,
      token,
    }).then((res) => {
      dispatch(setFeeds(res.list));
      dispatch(setFeedIdList(res.list.map((item) => item._id)));
      dispatch(hasMoreFeed(res.metadata.hasMore));
      dispatch(setFeedsName("publicKeywordAdvanceSearchConversation"));
      dispatch(setTotalFeed(res.metadata.totalCount));
      dispatch(setMessageBox(true));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
      dispatch(setMessageBoxCloseBtn(true));
    });
  };
  const getOrgFeeds = (msg) => {
    console.log(page);
    console.log(userRole);
    console.log(communityHeaderTab);
    console.log(tag);
    console.log("getOrgFeeds");
    if (userRole === "admin") {
      if (communityHeaderTab === "conversations") {
        if (page !== "search") {
          fetchOrgAllFeeds();
        } else if (page === "search") {
          // Need to fetch all feed with specifice keyword on all commuity or specific community
          if (feedName === "tagsearch") {
            getFeedByTag({
              keyword: tag,
              status: userRole === "admin" ? "all" : "live",
              appId,
              token,
            }).then((response) => {
              if (response.length === 0) {
                dispatch(setMessageTxt("No data found"));
                dispatch(setMessageBoxCloseBtn(true));
                window.scrollTo(0, 0);
              } else {
                dispatch(setFeeds(response.list));
                dispatch(setMessageBox(false));
                dispatch(setFeedIdList(response.list.map((item) => item._id)));
                dispatch(hasMoreFeed(response.metadata.hasMore));
                dispatch(setMessageBoxCloseBtn(true));
                dispatch(setMessageTxt(""));
                window.scrollTo(0, 0);
              }
            });
          } else if (feedName === "publicKeywordAdvanceSearchConversation") {
            fetchAdvanceSearchConversation();
          }
        } else {
          console.log("Normail hit");
        }
      } else if (communityHeaderTab === "scheduled") {
        getAllScheduedFeeds();
      } else if (communityHeaderTab === "past") {
        fetchPastFeeds();
      }
    }
  };

  const getAllScheduedFeeds = (msg) => {
    getAllScheduedPosts({
      communityId,
      appId,
      token,
    }).then((feedResponse) => {
      console.log(feedResponse);
      dispatch(setFeeds(feedResponse.list));
      dispatch(setMessageBoxCloseBtn(true));
      dispatch(setMessageBoxCloseBtn(true));
      dispatch(setFeedIdList(feedResponse.list.map((item) => item._id)));
      dispatch(hasMoreFeed(feedResponse.metadata.hasMore));
      dispatch(setTotalFeed(feedResponse.metadata.total));
      dispatch(
        setMessageTxt(
          feed.type === "Discussion"
            ? "Sucessfully Edited Discussion."
            : "Sucessfully Edited Question."
        )
      );
    });
  };

  const fetchPastFeeds = () => {
    try {
      dispatch(setFeeds([]));
      dispatch(setPost(""));
      dispatch(setCommuinityHeaderTab("past"));
      getPastFeeds({
        communityId,
        appId,
        token,
      }).then((response) => {
        console.log(response.list);

        dispatch(setFeeds(response.list));
        dispatch(setFeedIdList(response.list.map((item) => item._id)));
        dispatch(hasMoreFeed(response.metadata.hasMore));
        dispatch(setTotalFeed(response.metadata.total));
        dispatch(setMessageBox(true));
        dispatch(setMessageBoxCloseBtn(true));
        dispatch(
          setMessageTxt(
            feed.type === "Discussion"
              ? "Sucessfully Edited Discussion."
              : "Sucessfully Edited Question."
          )
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeeds = () => {
    try {
      if (communityHeaderTab === "conversations") {
        console.log("feed for conver");
        getAllFeedList();
      } else if (communityHeaderTab === "scheduled") {
        getAllScheduedFeeds();
      } else if (communityHeaderTab === "past") {
        fetchPastFeeds();
      } else {
        console.log("Get all feeds");
        getAllFeedList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendEmailToUsers = (newUsers) => {
    if (newUsers.length > 0) {
      dispatch(setMessageTxt("Sending email to newly added users ..."));
      addUserOnFeedEmail({
        userIds: newUsers,
        communityName: community.name,
        communityId: community._id,
        communityFeedId: newUsers?._id,
        token,
        appId,
        title: title || shortQuestionContent(question),
        type: "withPushNotification",
      })
        .then((emailResponse) => {
          if (emailResponse.status === 200) {
            return userRole === "user" ? fetchFeeds() : getOrgFeeds();
          } else {
            dispatch(setMessageTxt("Technical Problems while sending emails"));
            dispatch(setMessageBoxCloseBtn(true));
            return userRole === "user" ? fetchFeeds() : getOrgFeeds();
          }
        })
        .catch((error) => {
          dispatch(setMessageTxt("Technical Problems while sending emails"));
          dispatch(setMessageBoxCloseBtn(true));
          console.error(error);
        });
    } else {
      console.log("Normal Fetch only");
      return userRole === "user" ? fetchFeeds() : getOrgFeeds();
    }
  };

  const editDiscussion = (payload) => {
    try {
      console.log("editDiscussion");
      editDiscussionFeed(payload)
        .then((response) => {
          /* Sending Email to new users if exists otherwise fetch feed only  */

          let initUsers = initTaggedUsers.map((item) => item._id);
          let newUsers = payload.userIds.filter(
            (item) => initUsers.indexOf(item) < 0
          );
          if (isScheduleFeed() === true) {
            sendEmailToNewUsersForScheduleFeed(response);
          } else {
            sendEmailToUsers(newUsers);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const editQuestion = (payload) => {
    editQuestionFeed(payload)
      .then((response) => {
        /* Sending Email to new users if exists otherwise fetch feed only  */
        let initUsers = initTaggedUsers.map((item) => item._id);
        let newUsers = payload.userIds.filter(
          (item) => initUsers.indexOf(item) < 0
        );

        if (isScheduleFeed() === true) {
          sendEmailToNewUsersForScheduleFeed(response);
        } else {
          sendEmailToUsers(newUsers);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const adminQuestionEdit = (payload) => {
    editQuestionByAdmin(payload)
      .then((response) => {
        console.log(payload);
        if (response.status === 200) {
          let initUsers = initTaggedUsers.map((item) => item._id);
          let newUsers = payload.userIds.filter(
            (item) => initUsers.indexOf(item) < 0
          );
          if (isScheduleFeed() === true) {
            sendEmailToNewUsersForScheduleFeed(response);
          } else {
            sendEmailToUsers(newUsers);
          }
        } else {
          dispatch(setMessageTxt("Something went wrong while editing feed."));
          dispatch(setMessageBoxCloseBtn(true));
        }
      })
      .catch((error) => {
        dispatch(setMessageTxt("Something went wrong while editing feed."));
        dispatch(setMessageBoxCloseBtn(true));
        console.log("Error from edit question api for admin", error);
      });
  };

  const adminDiscussionEdit = (payload) => {
    console.log(payload);
    editDiscussionByAdmin(payload)
      .then((response) => {
        if (response?.data?.metadata?.status === "Success") {
          let modified = response?.data?.data.assignedLearningTopics?.length
            ? response?.data?.data.assignedLearningTopics?.map((data) => ({
                label: data?.name,
                value: data?.id,
              }))
            : [];
          setSelectedValue(modified);
          setAssignedLearningTopics(
            response?.data?.data.assignedLearningTopics
          );
        }

        let initUsers = initTaggedUsers.map((item) => item._id);
        let newUsers = payload.userIds.filter(
          (item) => initUsers.indexOf(item) < 0
        );

        if (isScheduleFeed() === true) {
          sendEmailToNewUsersForScheduleFeed(response);
        } else {
          sendEmailToUsers(newUsers);
        }
      })
      .catch((error) => {
        dispatch(setMessageTxt("Something went wrong while editing feed."));
        dispatch(setMessageBoxCloseBtn(true));
        console.log("Error from edit discussion api for admin", error);
      });
  };

  const editPost = async () => {
    try {
      let payload = {
        feedId,
        title,
        question,
        description,
        startDate,
        endDate,
        rating: 5,
        communityId: feedCommunityId,
        topics,
        userIds: taggedUsers.map((item) => item._id),
        attachments: attachments,
        token,
        appId,
        assignedLearningTopics,
      };
      if (feed.type === "Question") {
        dispatch(setMessageBox(true));
        dispatch(setMessageBoxCloseBtn(false));
        dispatch(setMessageTxt("Editing Question ..."));

        // If Original Community Id is Equal to Current Community Id then make edit otherwise need to delete post and add the post
        console.log(communityId + "===" + originalCommunityId);
        if (feedCommunityId === originalCommunityId) {
          if (userRole === "user") {
            editQuestion(payload);
          } else if (userRole === "admin") {
            payload.isAdmin = true;
            adminQuestionEdit(payload);
          }
        } else {
          payload.communityId = feedCommunityId;
          if (userRole === "user") {
            deleteAndAddQuestion(payload);
          } else if (userRole === "admin") {
            payload.isAdmin = true;
            deleteAndAddQuestionByAdmin(payload);
          }

          // editQuestionByAdmin(payload);
        }
      } else if (feed.type === "Discussion") {
        dispatch(setMessageBox(true));
        dispatch(setMessageBoxCloseBtn(false));
        dispatch(setMessageTxt("Editing Discussion ..."));
        // Check if editing on same community
        if (feedCommunityId === originalCommunityId) {
          if (userRole === "user") {
            console.log("my own post");
            editDiscussion(payload);
          } else if (userRole === "admin") {
            adminDiscussionEdit(payload);
          }
        } else {
          payload.communityId = feedCommunityId;
          console.log("deleteAndAddDiscussion", payload);
          if (userRole === "user") {
            deleteAndAddDiscussion(payload);
          } else if (userRole === "admin") {
            payload.isAdmin = true;
            deleteAndAddDiscussionByAdmin(payload);
          }
          // editDiscussionByAdmin(payload);
        }
      }
      dispatch(setFeedMode({ id: feedId, mode: "" }));
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsersByKeywords = (e) => {
    try {
      console.log(e);
      if (e.target.value) {
        let patt = new RegExp(e.target.value, "g");
        console.log(originalMember);

        let allMembs = [...originalMember].filter((item) =>
          patt.test(item.firstName + " " + item.lastName)
        );
        console.log(allMembs);
        if (allMembs.length > 0) {
          console.log("Fill mem");
          setMembers([...allMembs]);
        } else if (e.target.value.length === 0) {
          console.log("Empty");
          setMembers(originalMember);
        } else {
          console.log("No thing");
        }
      } else {
        console.log("Setting Original", originalMember);
        console.log(members);
        console.log(feed);
        setOriginalMember(feed.contents.userIds);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const setTopicsTags = (e) => {
    try {
      setTopicNames(e.target.value);
      console.log("topics :", topics);
      console.log("value :", e.target.value);

      if (e.target.value.search(",") >= 0) {
        let tagsColl = [...topics];
        console.log("tagsColl :", tagsColl);
        let inputStr = e.target.value.replace(",", "");

        if (!topics.find((item) => item === inputStr)) {
          tagsColl.push(inputStr);

          setTopics(tagsColl);
          setTopicNames("");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const format = (command, value) => {
    document.execCommand(command, false, value);
  };
  const setUrl = () => {
    try {
      var sText = document.getSelection();
      document.execCommand(
        "insertHTML",
        false,
        '<a href="' + sText + '" target="_blank">' + sText + "</a>"
      );
    } catch (error) {
      console.error(error);
    }
  };
  const removeUserTag = (item) => {
    try {
      let myTopics = [...taggedUsers];
      let index = myTopics.indexOf(item);

      myTopics.splice(index, 1);
      setTaggedUsers(myTopics);
    } catch (error) {
      console.error(error);
    }
  };
  const removeTag = (item) => {
    try {
      let myTopics = [...topics];

      let index = myTopics.indexOf(item);

      myTopics.splice(index, 1);
      setTopics(myTopics);
    } catch (error) {
      console.error(error);
    }
  };

  const findFileType = (str) => {
    try {
      let imgPattern = /image/g;
      let videoPattern = /video/g;
      let imgTest = imgPattern.test(str);
      return imgTest ? "image" : videoPattern.test(str) ? "video" : "other";
    } catch (error) {
      console.error(error);
    }
  };
  const findoutFileType = (str) => {
    try {
      let splited = str.split(".");
      let lastIndexVal = splited.length - 1;

      if (
        splited[lastIndexVal] === "jpg" ||
        splited[lastIndexVal] === "jpeg" ||
        splited[lastIndexVal] === "png" ||
        splited[lastIndexVal] === "gif"
      ) {
        return "image";
      } else if (splited[lastIndexVal] === "mp4") {
        return "video";
      } else {
        return "other";
      }
    } catch (error) {
      console.error(error);
    }
  };
  const uploadFiles = async (e) => {
    try {
      var fileType = findFileType(e.target.files[0].type);
      var fileName = e.target.files[0].name;
      var totalFiles = e.target.files.length;
      if (fileFlag === true) {
        setFileFlag(false);
        if (e && e.target && e.target.files && e.target.files.length > 0) {
          let i = 0;
          let axiosCollection = [];
          var fileInfo = [];
          while (i < totalFiles) {
            setUploading(true);
            axiosCollection[i] = fileUploader(e.target.files[i]);

            fileInfo[i] = {
              name: e.target.files[i].name,
              type: e.target.files[i].type,
            };

            i++;
          }
          Promise.allSettled(axiosCollection).then((res) => {
            var coll = [];
            res.map((item, index) => {
              if (item.status === "fulfilled") {
                let dataThumbnail =
                  item.value.data.data[0] && item.value.data.data[0].thumbnail
                    ? item.value.data.data[0].thumbnail
                    : "";
                let data =
                  item.value.data.data[1] && item.value.data.data[1].fileToSend
                    ? item.value.data.data[1].fileToSend
                    : item.value.data.data[0].fileToSend;

                coll.push({
                  fileType: findoutFileType(data.Location),
                  fileName: fileInfo[index].name,
                  fileUrl: data.Location,
                  thumbnailUrl:
                    item.value.data.data[0] && item.value.data.data[0].thumbnail
                      ? dataThumbnail.Location
                      : "",
                  key: data.key,
                });
              }
            });
            setAttachments([...attachments, ...coll]);
            setFileFlag(true);
            setUploading(false);
          });
        }
      }
      e.preventDefault();
      e.stopPropagation();
    } catch (error) {
      console.error(error);
    }
  };

  const putTitle = (e) => {
    try {
      setTitle(() => e.target.value);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setFeedCommunityId(feed.communityId);
    if (userRole === "admin") {
      setCommunityList(allCommunity?.data);
    } else {
      setCommunityList(myCommunity?.data);
    }

    //setFeedCommunityName()
  }, [feed]);

  useEffect(() => {
    let obj = communityList?.find((item) => item?._id === feed?.communityId);
    setFeedCommunityName(obj?.name);
  }, [communityList]);
  // Setting Initial Value

  useEffect(() => {
    try {
      let content = JSON.parse(feed.content);
      setTitle(content.title ? content.title : "");
      setQuestion(content.question ? content.question : "");
      setDescription(content.description ? content.description : "");
      setOneTimedesc(content.description || content.question);
      setOriginalCommunityId(feed.communityId);
      setAttachments(feed.attachments ? JSON.parse(feed.attachments) : []);
      if (
        feed?.assignedLearningTopics &&
        feed?.assignedLearningTopics?.length
      ) {
        let modified = feed?.assignedLearningTopics?.map((data) => ({
          label: data?.name,
          value: data?.id,
        }));
        setSelectedValue(modified);
        setAssignedLearningTopics(feed?.assignedLearningTopics);
      }

      if (communityId === null) {
        if (userRole === "user") {
          setCommunity(
            [...myCommunity.data].find((item) => item._id === feed.communityId)
          );
        } else if (userRole === "admin") {
          // console.log("Consoling from admin if condition")
          setCommunity(
            [...allCommunity.data].find((item) => item._id === feed.communityId)
          );
        }
      } else {
        setCommunity(() => currentCommunity);
      }

      if (content && content.tags && content.tags.length > 0) {
        setTopics(() => content.tags);
        setIsTopic(true);
      }

      // Check if object has start and end date.
      if (
        feed.startDate &&
        feed.endDate &&
        feed.startDate.length > 0 &&
        feed.endDate.length > 0
      ) {
        setIsStartEndDate(true);
        setStartDate(feed.startDate);
        setEndDate(feed.endDate);
      }

      // Get User Details from community and assign to member

      let communityUsers;
      if (userRole === "user") {
        communityUsers = myCommunity?.data?.find(
          (item) => item._id === feed.communityId
        )?.communityUsers;
      } else if (userRole === "admin") {
        communityUsers = allCommunity?.data?.find(
          (item) => item?._id === feed.communityId
        )?.communityUsers;
      }

      setLoadingUsers("Loading Users ...");
      getUsersDetail({
        userIds: communityUsers,
        token,
        appId,
      })
        .then((response) => {
          console.log(response);
          if (
            response &&
            response.status === 200 &&
            response.data &&
            response.data.data
          ) {
            // Set All Members with selected community
            let responseData = response?.data?.data;

            setMembers(() =>
              responseData.filter((item) => item?._id !== userId)
            );
            // Set all Selected Member for this feed
            let selectedUsers = [];

            responseData.forEach((item) => {
              if (
                content &&
                content.userIds &&
                content.userIds.length > 0 &&
                content.userIds.indexOf(item._id) >= 0
              ) {
                selectedUsers.push(item);
              }
            });

            setInitTaggedUsers(selectedUsers);
            setTaggedUsers(selectedUsers);
            setLoadingUsers(null);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      // Get User Detail from MyConnect from User ID
      let selectedUsersIds = content.userIds;
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Validation purpose only

  useEffect(() => {
    try {
      let isValidTitle = title && title.length > 0;
      let isValidDescription = false;

      isValidDescription = description && description.length > 0;

      let isValidQuestion = false;
      isValidQuestion = question && question.length > 0;

      let isValidForm;
      if (feed.type === "Discussion") {
        isValidForm = isValidDescription && isValidTitle && isValidDate;
      }

      if (feed.type === "Question") {
        isValidForm = isValidQuestion && isValidDate;
      }

      console.log("Is Valid Form", isValidForm ? " Yes" : "No");
      setIsValidForm(() => isValidForm);
    } catch (error) {
      console.error(error);
    }
  }, [
    title,
    description,
    startDate,
    endDate,
    oneTimedesc,
    isValidDate,
    question,
  ]);

  const removeFileFromAttachcments = (id) => {
    try {
      console.log("removeFileFromAttachcments..", id);
      console.log(attachments);
      setAttachments(attachments.filter((item) => item.key !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const setSchedule = (obj) => {
    try {
      console.log("Schedule Date", obj);
      console.log(obj.data instanceof Date ? "Yes Date" : "No Date");

      if (obj.title === "start") {
        setStartDate(new Date(obj.data));
      } else {
        setEndDate(new Date(obj.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeDatePicker = () => {
    try {
      setIsStartEndDate(false);
      setStartDate("");
      setEndDate("");
      setIsValidDate(true);
    } catch (error) {
      console.error(error);
    }
  };

  const removeScheduleTask = () => {
    try {
      setIsStartEndDate(!isStartEndDate);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error(error);
    }
  };
  const getAllUsesDetail = (users) => {
    setLoadingUsers("Loading Users ...");
    getUsersDetail({
      userIds: users,
      token,
      appId,
    })
      .then((response) => {
        console.log(response);
        setLoadingUsers("");
        if (
          response &&
          response.status === 200 &&
          response.data &&
          response.data.data
        ) {
          // Set All Members with selected community
          let responseData = response.data.data;
          setMembers(() => responseData.filter((item) => item._id !== userId));
          setOriginalMember(() =>
            responseData.filter((item) => item._id !== userId)
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setLoadingUsers("");
      });
  };
  const changeCommunity = (item) => {
    try {
      console.log("Change Commuity", item);
      setFeedCommunityName(item?.name);
      setFeedCommunityId(item._id);
      setCommunity(() => item);
      setTaggedUsers([]);
      setMembers(() => []);
      setTaggedUsers(() => []);
      getAllUsesDetail(item.communityUsers);
      dispatch(
        setFeedUsers({
          id: feed._id,
          users: [],
        })
      );
      //dispatch(setCommunityId(item._id));
    } catch (error) {
      console.error(error);
    }
  };

  const getAllLearningTopics = (search_key) => {
    let params = {
      limit: 500,
      page_number: 1,
      search_key: search_key || "",
    };
    getLearningTopics({ token, appId, orgId, params })
      .then((res) => {
        if (res?.data?.success && res?.data?.LearningTopics?.length) {
          let modifiedData = res?.data?.LearningTopics.map((data) => ({
            label: data?.topic_name,
            value: data?._id,
          }));
          setLearningTopics(modifiedData);
          setAllLearningTopics(modifiedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllLearningTopics();
  }, []);

  const handleSearchChange = (search_key) => {
    if (search_key && allLearningTopics?.length) {
      setSearchKey(search_key);
      let filtered = allLearningTopics.filter((topic) =>
        topic.label.toLowerCase().includes(search_key.toLowerCase())
      );
      setLearningTopics(filtered);
    } else {
      setSearchKey("");
      setLearningTopics(allLearningTopics);
    }
  };

  const handleValueChange = (data) => {
    setSelectedValue(data);
    if (data) {
      let modified = data.length
        ? data.map((item) => ({
            id: item.value,
            name: item.label,
          }))
        : [];
      setAssignedLearningTopics(modified);
    }
  };

  return (
    <div className="posting-section-body position-relative">
      <div className="form-row">
        {((myCommunity && myCommunity.data) ||
          (allCommunity && allCommunity.data)) && (
          <>
            <span>Community : </span>
            <CustomSelectBox
              data={communityList}
              onSelected={(item) => changeCommunity(item)}
              selected={feedCommunityName}
            />
          </>
        )}
      </div>

      {feed.type === "Discussion" && (
        <>
          <input
            type="text"
            placeholder="Type here to title your post"
            className="discussTitle"
            onChange={(e) => putTitle(e)}
            value={title}
          />
          <Editor
            description={oneTimedesc}
            onSetDescription={(val) => setDescription(val)}
          />
        </>
      )}

      {feed.type === "Question" && (
        <div className="card common-card question-card">
          <div className="card-header">
            <div className="card-box-holder">
              <div className="card-box">
                <img
                  src={
                    process.env.REACT_APP_SITE_URL + "icon-white-question.svg"
                  }
                  alt="icon"
                  loading="lazy"
                />
              </div>
              <span>Question</span>
            </div>
          </div>
          <Editor
            description={oneTimedesc}
            onSetDescription={(val) => setQuestion(val)}
            placeholder="Post a Question"
          />
        </div>
      )}

      {uploading && (
        <div className="uploading">
          <span>Uploading files ...</span>
        </div>
      )}

      {attachments && attachments.length > 0 && (
        <FilePanel
          attachments={attachments}
          onRemoveFile={(id) => removeFileFromAttachcments(id)}
        />
      )}

      {isStartEndDate && (
        <StartEndDate
          onScheduled={(obj) => setSchedule(obj)}
          onSetStartDate={(val) => setStartDate(val)}
          onSetEndDate={(val) => setEndDate(val)}
          startDate={startDate ? new Date(startDate) : ""}
          endDate={endDate ? new Date(endDate) : ""}
          onIsValidDate={(obj) => setIsValidDate(obj)}
          onRemoveDatePicker={() => removeDatePicker()}
        />
      )}
      {userRole === "admin" &&
        (feed.type === "Discussion" || feed.type === "Question") && (
          <div style={{ width: "100%", zIndex: "985" }}>
            <MultiSelectDropdown
              multiple
              options={learningTopics}
              value={selectedValue}
              onChange={handleValueChange}
              placeholder="Select Subjects"
              handleSearchChange={handleSearchChange}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              inputValue={searchKey}
              setInputValue={setSearchKey}
            />
          </div>
        )}
      <div className="d-flex align-items-center ">
        <span className="small-txt">{loadingUsers}</span>

        {feedCommunityId && !loadingUsers && (
          <UserTag
            members={members}
            taggedUsers={taggedUsers}
            onSearchUsersByKeywords={(e) => searchUsersByKeywords(e)}
            onTagUser={(item) => tagToUser(item)}
            onRemoveUserTag={(item) => removeUserTag(item)}
          />
        )}
      </div>

      {isTopic && (
        <>
          <TopicTag
            onSetTopics={(e) => setTopicsTags(e)}
            onRemoveTopic={(item) => removeTag(item)}
            topicNames={topicNames}
            topics={topics}
          />
        </>
      )}
      <PostFooter
        isValidForm={isValidForm}
        onFormat={(pass) => format(pass)}
        onSetUrl={() => setUrl()}
        onSetIsStartEndDate={() => setIsStartEndDate(!isStartEndDate)}
        onSetIsTopic={() => setIsTopic(!isTopic)}
        onUploadFiles={(e) => uploadFiles(e)}
        onCreateDiscussionPost={editPost}
        active="comment"
        btnTitle="Edit"
        feedId={feed._id}
      />
    </div>
  );
}

export default React.memo(EditFeed);
