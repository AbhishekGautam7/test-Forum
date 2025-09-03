import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CustomSelectBox from "../modules/CustomSelectBox";
import TopicTag from "../modules/TopicTag";

import { useGetCommunityNames } from "./useGetCommunityNames";

import {
  addDiscuss,
  addUserOnFeedEmail,
  addUserOnScheduleFeedEmail,
  fileUploader,
  getUsersDetail,
} from "../../api/community";
import { fetchOrgFeeds } from "../../api/orgAdmin";

import {
  addFeed,
  addFeedIdListById,
  hasMoreFeed,
  removeLastFeed,
  setFeedIdList,
  setFeeds,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setPost,
} from "../../redux";

import useChatStore from "../../stores/chatStore";
import Editor from "../modules/Editor";
import FilePanel from "../modules/FilePanel";
import PostFooter from "../modules/PostFooter";
import StartEndDate from "../modules/StartEndDate";
import UserTag from "../modules/UserTag";
import MultiSelectDropdown from "../modules/MultiSelectDropdown";
import { getLearningTopics } from "../../api/myconnect";
import { debounce } from "../../libary/debounce";

function CreateDiscussion() {
  const [community, setCommunity] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topicNames, setTopicNames] = useState("");
  const [topics, setTopics] = useState([]);
  const [isTopic, setIsTopic] = useState(false);
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [originalMember, setOriginalMember] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [fileFlag, setFileFlag] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isStartEndDate, setIsStartEndDate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState("");
  const [isValidDate, setIsValidDate] = useState(true);
  const dispatch = useDispatch();

  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const userId = useSelector((state) => state.info.userId);
  const myCommunity = useSelector((state) => state.myCommunity);
  const communityId = useSelector((state) => state.info.communityId);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const allCommunity = useSelector((state) => state.allCommunity);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const myProfile = useSelector((state) => state.myProfile.data);
  const perPageFeed = useSelector((state) => state.feeds.perPageFeed);
  const feeds = useSelector((state) => state.feeds.data);
  const orgId = useSelector((state) => state.info.orgId);

  const [selectedValue, setSelectedValue] = useState([]);
  const [learningTopics, setLearningTopics] = useState([]);
  const [allLearningTopics, setAllLearningTopics] = useState([]);
  const [assignedLearningTopics, setAssignedLearningTopics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const { communityNamesData, isLoading } = useGetCommunityNames();

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

  const flushData = () => {
    setCommunity(() => "");
    setDescription(() => "");
    setStartDate(() => "");
    setEndDate(() => "");
    setTopicNames(() => "");
    setTopics(() => []);
    setIsTopic(() => false);
    setTitle(() => "");
    setMembers(() => []);
    setTaggedUsers(() => []);
    setFileFlag(() => true);
    setAttachments(() => []);
    setIsValidForm(() => false);
    setIsStartEndDate(() => false);
  };
  const tagToUser = (item) => {
    setTaggedUsers(() => [...taggedUsers, item]);
  };

  const sendEmailToNewUsersForFeed = (res) => {
    try {
      addUserOnFeedEmail({
        userIds: taggedUsers.map((item) => item._id),
        communityName: community.name,
        communityId: community._id,
        communityFeedId: res?.data?.data?.feedId,
        title: title,
        appId,
        token,
      })
        .then((emailResponse) => {
          console.log(emailResponse);
          if (emailResponse.status === 200) {
            dispatch(setMessageTxt(res.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
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
    } catch (error) {
      console.error(error);
    }
  };

  const sendEmailToNewUsersForScheduleFeed = (res) => {
    try {
      let startdate = new Date(startDate);
      let yy = startdate.getFullYear();
      let mm = startdate.getMonth() + 1;
      let dd = startdate.getDate();
      let scheduleDate = mm + "/" + dd + "/" + yy;

      addUserOnScheduleFeedEmail({
        userIds: taggedUsers.map((item) => item._id),
        communityName: community.name,
        communityId: community?._id,
        communityFeedId: res?.data?.data?.feedId,
        title,
        scheduleDate,
        appId,
        token,
      })
        .then((emailResponse) => {
          console.log(emailResponse);
          if (emailResponse.status === 200) {
            dispatch(setMessageTxt(res.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
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
    } catch (error) {
      console.error(error);
    }
  };

  const createDiscussionPost = async () => {
    try {
      console.log("Start Date :", startDate.length);
      console.log("End Date :", endDate.length);
      if ((!startDate && endDate) || (startDate && !endDate)) {
        dispatch(setMessageBox(true));
        dispatch(setMessageTxt("Both Start Date and End Date need to be fill"));
        dispatch(setMessageBoxCloseBtn(true));
        return false;
      }
      if (startDate) {
        console.log("UTC Date 1 :", startDate.toUTCString());
      }
      console.log(topicNames);
      console.log(topics);

      let tags = [];
      topics.length > 0 && tags.push(...topics);
      topicNames.length > 0 && tags.push(topicNames);

      console.log(tags);
      setTopics(tags);
      let payload = {
        title: title,
        assignedLearningTopics: assignedLearningTopics || [],
        description: description,
        startDate: startDate
          ? startDate.toUTCString()
          : new Date().toUTCString(),
        endDate: endDate ? endDate.toUTCString() : null,
        rating: 5,
        communityId: community._id,
        topics: tags,
        userIds: taggedUsers.map((item) => item._id),
        attachments: attachments,
        appId,
        isAdmin: userRole === "admin",
        likesCount: 0,
        commentCount: 0,
        token,
      };
      console.log(payload);
      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Creating Discussion ..."));
      dispatch(setMessageBoxCloseBtn(false));
      await addDiscuss(payload).then((res) => {
        console.log(res);

        if (res.status === 200) {
          console.log("Resonse of Creating :", res.data);
          console.log("commuity", community);
          dispatch(addFeedIdListById(res.data.data._id));
          let resData = res.data.data;
          let content = {
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            createdBy: resData && resData.createdBy ? resData.createdBy : "",
            userIds:
              taggedUsers && taggedUsers.length > 0
                ? taggedUsers.map((item) => item._id)
                : [],
            tags: resData.tags,
          };
          let contents = {
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            createdBy: resData && resData.createdBy ? resData.createdBy : "",
            userIds:
              taggedUsers && taggedUsers.length > 0
                ? taggedUsers.map((item) => item._id)
                : [],
            tags: resData.tags,
            usersDetails: taggedUsers,
          };

          let payload = {
            _id: resData && resData.feedId ? resData.feedId : "",
            attachments: attachments ? JSON.stringify(attachments) : [],
            clientId: resData && resData.clientId ? resData.clientId : "",
            commentCount: 0,
            communityId:
              resData && resData.clientId ? resData.communityId : null,
            content: content ? JSON.stringify(content) : "",
            createdAt: resData && resData.createdAt ? resData.createdAt : null,
            organizationId:
              resData && resData.organizationId ? resData.organizationId : null,
            tenentId: resData && resData.tenentId ? resData.tenentId : null,
            typeId: "",
            type: "Discussion",
            createdBy: userId,
            communityName: community && community.name ? community.name : "",
            contents: contents,
            info: myProfile,
            commentStatus: false,
            deleted: false,
            tags: resData.tags,
            likesCount: 0,
            commentCount: 0,
          };
          let fetchOrgfeedsPayload = {
            communityId: currentCommunity?.isDefaultCommunity
              ? null
              : communityId,
            appId,
            token,
          };
          console.log("payload after add :", payload);

          if (contents && contents.userIds && contents.userIds.length > 0) {
            dispatch(setMessageTxt("Sending email to selected users ..."));
            dispatch(setMessageBoxCloseBtn(false));
            if (isScheduleFeed() === true) {
              sendEmailToNewUsersForScheduleFeed(res);
            } else {
              sendEmailToNewUsersForFeed(res);
            }
          } else {
            dispatch(setMessageTxt(res.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
          }

          if (userRole === "admin") {
            realoadFeeds(fetchOrgfeedsPayload);
          } else {
            addFeedPost(payload);
          }
        } else {
          dispatch(setMessageTxt(res.data.metadata.message));
          dispatch(setMessageBox(true));
          dispatch(setMessageBoxCloseBtn(true));
          flushData();
        }
      });
      resetAllState();
    } catch (error) {
      console.error(error);
    }
  };

  const isEndDateValid = () => {
    let isEndDateValidYear = false;
    let isEndDateValidMonth = false;
    let isEndDateValidDate = false;

    let endDateObj = new Date(endDate);

    let isEndDateValid = false;

    // Need to have endDate must be greater or equal to current Date . Comparing only uear,month and date only
    isEndDateValidYear =
      endDateObj.getFullYear() >= new Date().getFullYear() ? true : false;
    isEndDateValidMonth =
      endDateObj.getMonth() >= new Date().getMonth() ? true : false;
    isEndDateValidDate =
      endDateObj.getDate() >= new Date().getDate() ? true : false;
    return isEndDateValidYear === true &&
      isEndDateValidMonth === true &&
      isEndDateValidDate === true
      ? true
      : false;
  };

  const isStartDateValid = () => {
    let isStartDateValidYear = false;
    let isStartDateValidMonth = false;
    let isStartDateValidDate = false;
    let isStartDateValid = false;

    // Start date must not be greater than today date
    let startDateObj = new Date(startDate);
    isStartDateValidYear =
      startDateObj.getFullYear() <= new Date().getFullYear() ? true : false;
    isStartDateValidMonth =
      startDateObj.getMonth() <= new Date().getMonth() ? true : false;
    isStartDateValidDate =
      startDateObj.getDate() <= new Date().getDate() ? true : false;

    return isStartDateValidYear === true &&
      isStartDateValidMonth === true &&
      isStartDateValidDate === true
      ? true
      : false;
  };

  const isScheduleFeed = () => {
    return endDate && startDate ? true : false;
  };

  const addFeedPost = (payload) => {
    if (endDate && startDate) {
      if (isEndDateValid() && isStartDateValid()) {
        console.log("Posing with start and end date");
        dispatch(addFeed(payload));
      }
      dispatch(setMessageBox(true));
      dispatch(setPost(""));
      flushData();
    } else {
      dispatch(addFeed(payload));

      if (feeds.length >= perPageFeed) {
        dispatch(removeLastFeed());
      }
      dispatch(setPost(""));
    }
  };

  const realoadFeeds = (payload) => {
    fetchOrgFeeds(payload).then((res) => {
      console.log(res);
      dispatch(setFeeds(res.list));
      dispatch(setFeedIdList(res.list.map((item) => item._id)));
      dispatch(hasMoreFeed(res.metadata.hasMore));
      flushData();
    });
    dispatch(setPost(""));
  };

  const searchUsersByKeywords = (e) => {
    try {
      console.log(members);
      console.log(e.target.value);
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
      if (e.target.value) {
        let patt = new RegExp(e.target.value.toLowerCase(), "g");
        console.log(originalMember);
        let allMembs = [...originalMember].filter((item) =>
          patt.test(
            item.firstName.toLowerCase() + " " + item.lastName.toLowerCase()
          )
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
        console.log(originalMember);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setTopicsTags = (e) => {
    try {
      let keywordVal = e.target.value.trim();
      keywordVal = keywordVal.replace(new RegExp(" ", "g"), "");
      setTopicNames(keywordVal);
      console.log("topics :", topics);
      console.log("value :", keywordVal);
      let tagsColl = [...topics];
      if (keywordVal.search(",") >= 0) {
        console.log("tagsColl :", tagsColl);
        let inputStr = keywordVal.replace(",", "");

        if (!topics.find((item) => item === inputStr)) {
          tagsColl.push(inputStr);
          setTopics(tagsColl);
          setTopicNames("");
        }
      }
      console.log("Final Topics :", keywordVal);
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

            console.log(`axios${i}`, axiosCollection[i]);

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
    setTitle(() => e.target.value);
  };

  useEffect(() => {
    let abortController = new AbortController();
    let isValidTitle = title.length > 0;
    let isValidDescription =  description.length > 0;
    let isValidCommunity = community?._id === "" ? false : true;
    let isValidForm =
      isValidDescription && isValidTitle && isValidCommunity && isValidDate;

    setIsValidForm(() => isValidForm);
    console.log( ".......dhabhj......",{community:community._id} );
    return () => {
      abortController.abort();
    };
  }, [title, description, community, isValidDate]);

  useEffect(() => {
    let abortController = new AbortController();
    if (communityId != null) {
      setCommunity(() => currentCommunity);
    }
    setMembers(currentCommunity.communityUsers);
    return () => {
      abortController.abort();
    };
  }, [communityId, currentCommunity]);

  useEffect(() => {
    let abortController = new AbortController();
    if (communityId) {
      setMembers(currentCommunity?.communityUsers);

      if (loadingUsers.length === 0) {
        setLoadingUsers("Loading Users ...");
        getUsersDetail({
          userIds: currentCommunity?.communityUsers?.map((item) =>
            item._id ? item._id : item
          ),
          appId,
          token,
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
              setMembers(() =>
                responseData.filter((item) => item._id !== userId)
              );
              setOriginalMember(() =>
                responseData.filter((item) => item._id !== userId)
              );
            }
          })
          .catch((error) => {
            console.error(error);
            setLoadingUsers("");
          });
      }
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const removeFileFromAttachcments = (id) => {
    console.log("removeFileFromAttachcments..", id);
    console.log(attachments);
    setAttachments(attachments.filter((item) => item.key !== id));
  };

  const setSchedule = (obj) => {
    console.log("Schedule Date", obj);
    console.log(obj.data instanceof Date ? "Yes Date" : "No Date");

    if (obj.title === "start") {
      setStartDate(new Date(obj.data));
    } else {
      setEndDate(new Date(obj.data));
    }
  };

  const removeDatePicker = () => {
    setIsStartEndDate(false);
    setStartDate("");
    setEndDate("");
    setIsValidDate(true);
  };

  const removeScheduleTask = () => {
    setIsStartEndDate(!isStartEndDate);
    setStartDate("");
    setEndDate("");
  };

  const getAllUsesDetail = (users) => {
    console.log("user...", users);
    setLoadingUsers("Loading Users ...");
    getUsersDetail({
      userIds: users,
      appId,
      token,
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
    setCommunity(() => item);
    setTaggedUsers([]);
    setMembers(() => []);
    getAllUsesDetail(
      //   item?.communityUsers?.map((item) => (item._id ? item._id : item))
      item
    );
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

  useEffect(() => {
    getAllLearningTopics();
  }, []);

  return (
    <div className="common-box">
      <div className="posting-section-body position-relative">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          style={{
            position: "absolute",
            right: "10px",
            top: "-20px",
            fontSize: "0.6rem",
          }}
          onClick={() => dispatch(setPost("welcomebox"))}
        ></button>

        <div className="form-row">
          <span>
            <b>Community :</b>{" "}
          </span>
          <CustomSelectBox
            isLoading={isLoading}
            data={communityNamesData}
            onSelected={(item) => changeCommunity(item)}
            selected={community.name}
          />
        </div>

        <input
          type="text"
          placeholder="Type here to title your post"
          className="discussTitle"
          maxLength="120"
          onChange={(e) => putTitle(e)}
          value={title}
        />

        <Editor onSetDescription={(val) => setDescription(val)} description={description} />

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
            onSetStartDate={(val) => setStartDate(val)}
            onSetEndDate={(val) => setEndDate(val)}
            startDate={startDate}
            endDate={endDate}
            onScheduled={(obj) => setSchedule(obj)}
            onIsValidDate={(obj) => setIsValidDate(obj)}
            onRemoveDatePicker={() => removeDatePicker()}
          />
        )}
        {userRole === "admin" && (
          <div style={{ width: "100%", zIndex: "985" }}>
            <MultiSelectDropdown
              multiple
              options={learningTopics}
              value={selectedValue}
              onChange={handleValueChange}
              placeholder="Select Subjects"
              handleSearchChange={handleSearchChange}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              inputValue={searchKey}
              setInputValue={setSearchKey}
            />
          </div>
        )}

        <div className="d-flex align-items-center">
          {community && community._id && members && members.length > 0 && (
            <UserTag
              members={members}
              taggedUsers={taggedUsers}
              onSearchUsersByKeywords={(e) => searchUsersByKeywords(e)}
              onTagUser={(item) => tagToUser(item)}
              onRemoveUserTag={(item) => removeUserTag(item)}
            />
          )}
          {loadingUsers && loadingUsers.length > 0 && (
            <span className="small-txt">Loading Users ...</span>
          )}
        </div>

        {isTopic && (
          <TopicTag
            onSetTopics={(e) => setTopicsTags(e)}
            onRemoveTopic={(item) => removeTag(item)}
            topicNames={topicNames}
            topics={topics}
          />
        )}

        <PostFooter
          isValidForm={isValidForm}
          onFormat={(pass) => format(pass)}
          onSetUrl={() => setUrl()}
          onSetIsStartEndDate={() => removeScheduleTask()}
          onSetIsTopic={() => setIsTopic(!isTopic)}
          onUploadFiles={(e) => uploadFiles(e)}
          onCreateDiscussionPost={() => createDiscussionPost()}
          active="comment"
        />
      </div>
    </div>
  );
}

export default React.memo(CreateDiscussion);
