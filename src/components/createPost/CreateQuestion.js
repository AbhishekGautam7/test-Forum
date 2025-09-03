import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuestion,
  addUserOnFeedEmail,
  addUserOnScheduleFeedEmail,
  fileUploader,
  getUsersDetail,
} from "../../api/community";
import { fetchOrgFeeds } from "../../api/orgAdmin";
import {
  addFeed,
  addFeedIdListById,
  removeLastFeed,
  setFeeds,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setModal,
  setPost,
} from "../../redux";
import CustomSelectBox from "../modules/CustomSelectBox";
import Editor from "../modules/Editor";
import FilePanel from "../modules/FilePanel";
import PostFooter from "../modules/PostFooter";
import StartEndDate from "../modules/StartEndDate";
import TopicTag from "../modules/TopicTag";
import UserTag from "../modules/UserTag";
import MultiSelectDropdown from "../modules/MultiSelectDropdown";
import { getLearningTopics } from "../../api/myconnect";

function CreateQuestion() {
  const [title, setTitle] = useState("");
  const [community, setCommunity] = useState({});
  const [topics, setTopics] = useState([]);
  const [isTopic, setIsTopic] = useState(false);
  const [members, setMembers] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [fileFlag, setFileFlag] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isValidForm, setIsValidForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [topicNames, setTopicNames] = useState("");
  const [isStartEndDate, setIsStartEndDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loadingUsers, setLoadingUsers] = useState("");
  const [originalMember, setOriginalMember] = useState([]);
  const [isValidDate, setIsValidDate] = useState(true);
  const [selectedValue, setSelectedValue] = useState([]);
  const [learningTopics, setLearningTopics] = useState([]);
  const [allLearningTopics, setAllLearningTopics] = useState([]);
  const [assignedLearningTopics, setAssignedLearningTopics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const dispatch = useDispatch();

  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const userId = useSelector((state) => state.info.userId);
  const myCommunity = useSelector((state) => state.myCommunity);
  const communityId = useSelector((state) => state.info.communityId);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const allCommunity = useSelector((state) => state.allCommunity);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const feeds = useSelector((state) => state.feeds.data);
  const totalFeeds = useSelector((state) => state.feeds.totalFeeds);
  const perPageFeed = useSelector((state) => state.feeds.perPageFeed);
  const myProfile = useSelector((state) => state.myProfile.data);
  const orgId = useSelector((state) => state.info.orgId);

  const flushData = () => {
    try {
      setCommunity(() => "");
      setTopicNames(() => "");
      setTopics(() => []);
      setStartDate(() => "");
      setEndDate(() => "");
      setIsTopic(() => false);
      setTitle(() => "");
      setMembers(() => []);
      setTaggedUsers(() => []);
      setFileFlag(() => true);
      setAttachments(() => []);
      setIsValidForm(() => false);
      setIsStartEndDate(() => false);
    } catch (error) {
      console.error(error);
    }
  };

  const tagToUser = (item) => {
    try {
      setTaggedUsers(() => [...taggedUsers, item]);
    } catch (error) {
      console.error(error);
    }
  };
  const addFeedPost = (payload) => {
    try {
      if (endDate && startDate) {
        let isEndDateValidYear = false;
        let isEndDateValidMonth = false;
        let isEndDateValidDate = false;
        let isTodayDateValid = false;
        let endDateObj = new Date(endDate);
        let startDateObj = new Date(startDate);
        let isEndDateValid = false;

        // Need to have endDate must be greater or equal to current Date
        isEndDateValidYear =
          endDateObj.getFullYear() >= new Date().getFullYear() ? true : false;
        isEndDateValidMonth =
          endDateObj.getMonth() >= new Date().getMonth() ? true : false;
        isEndDateValidDate =
          endDateObj.getDate() >= new Date().getDate() ? true : false;
        isEndDateValid =
          isEndDateValidYear && isEndDateValidMonth && isEndDateValidDate
            ? true
            : false;

        let isStartDateValidYear = false;
        let isStartDateValidMonth = false;
        let isStartDateValidDate = false;
        let isStartDateValid = false;

        // Start date must not be greater than today date
        isStartDateValidYear =
          startDateObj.getFullYear() <= new Date().getFullYear() ? true : false;
        isStartDateValidMonth =
          startDateObj.getMonth() <= new Date().getMonth() ? true : false;
        isStartDateValidDate =
          startDateObj.getDate() <= new Date().getDate() ? true : false;

        isStartDateValid =
          isStartDateValidYear && isStartDateValidMonth && isStartDateValidDate
            ? true
            : false;

        // Starting and Ending Date must be greater or less than current date;
        //isTodayDateValid = endDateObj>= new Date() && startDateObj >= new Date() ? true : false;
        console.log(isEndDateValid);
        console.log(isStartDateValid);
        console.log(isTodayDateValid);
        if (isEndDateValid && isStartDateValid) {
          console.log("Posing with start and end date", payload);
          dispatch(addFeed(payload));
          if (feeds.length >= perPageFeed) {
            dispatch(removeLastFeed());
          }
        }
      } else {
        console.log(payload);
        dispatch(addFeed(payload));
        if (feeds.length >= perPageFeed) {
          dispatch(removeLastFeed());
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const reloadFeeds = (payload) => {
    try {
      fetchOrgFeeds(payload).then((res) => {
        dispatch(setFeeds(res?.list));
      });
      dispatch(setPost(""));
    } catch (error) {
      console.error(error);
    }
  };

  const shortQuestionContent = (content) => {
    try {
      console.log(content);
      let ele = document.createElement("div");
      ele.innerHTML = content;
      return ele.textContent.slice(0, 50) + "...";
    } catch (error) {
      console.error(error);
    }
  };
  const createQuestionPost = async () => {
    try {
      console.log("createQuestionPost");
      if ((!startDate && endDate) || (startDate && !endDate)) {
        dispatch(setMessageBox(true));
        dispatch(setMessageTxt("Both Start Date and End Date need to be fill"));
        dispatch(setMessageBoxCloseBtn(true));
        return false;
      }
      let tags = [];
      topics.length > 0 && tags.push(...topics);
      topicNames.length > 0 && tags.push(topicNames);

      let payload = {
        question: title,
        assignedLearningTopics: assignedLearningTopics || [],
        topics: tags,
        userIds: taggedUsers.map((item) => item._id),
        attachments: attachments,
        startDate: startDate
          ? startDate.toUTCString()
          : new Date().toUTCString(),
        endDate: endDate ? endDate.toUTCString() : null,
        appId,
        token,
      };

      if (community && community._id) {
        payload.communityId = community._id;
      } else if (currentCommunity && currentCommunity._id) {
        payload.communityId = currentCommunity._id;
      } else {
        payload.communityId = null;
      }

      dispatch(setMessageBox(true));
      dispatch(setMessageTxt("Creating Question ..."));
      dispatch(setMessageBoxCloseBtn(false));
      dispatch(setModal(true));
      await addQuestion(payload)
        .then((res) => {
          console.log(res);
          if (
            res &&
            res.data &&
            res.data.metadata &&
            res.data.metadata.message &&
            res.status === 200
          ) {
            console.log("sucessully");
            dispatch(addFeedIdListById(res.data.data._id));
            let resData = res.data.data;
            console.log(resData);
            let content = {
              question: title,
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
              question: title,
              startDate: startDate,
              endDate: endDate,
              createdBy: resData && resData.createdBy ? resData.createdBy : "",
              userIds:
                taggedUsers && taggedUsers.length > 0
                  ? taggedUsers.map((item) => item._id)
                  : [],
              tags: resData.tags,
              userIds:
                taggedUsers && taggedUsers.length > 0
                  ? taggedUsers.map((item) => item._id)
                  : [],

              usersDetails: taggedUsers,
            };

            let payload = {
              _id: resData && resData.feedId ? resData.feedId : "",
              attachments: attachments ? JSON.stringify(attachments) : [],
              clientId: resData && resData.clientId ? resData.clientId : "",
              commentCount: 0,
              communityId:
                resData && resData.communityId ? resData.communityId : null,
              content: content ? JSON.stringify(content) : "",
              createdAt:
                resData && resData.createdAt ? resData.createdAt : null,
              createdBy: userId,
              communityName: community && community.name ? community.name : "",
              organizationId:
                resData && resData.organizationId
                  ? resData.organizationId
                  : null,
              tenentId: resData && resData.tenentId ? resData.tenentId : null,
              type: "Question",
              contents: contents,
              info: myProfile,
              commentStatus: false,
              deleted: false,
              likesCount: 0,
              commentCount: 0,
            };

            let fetchOrgfeedsPayload = {
              communityId,
              appId,
              token,
            };

            /*
                    Check if user is tagged on feed if user is found with schedule
                    date then send email with sechdudle date api otherwise send 
                    with normal send email.
                    */
            if (contents && contents.userIds && contents.userIds.length > 0) {
              dispatch(setMessageTxt("Sending email to selected users ..."));
              console.log(shortQuestionContent(contents.question));
              // Sending email to the selected ussers for the feed
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
              reloadFeeds(fetchOrgfeedsPayload);
            } else {
              addFeedPost(payload);
            }

            // dispatch(addFeed(payload));

            dispatch(setPost(""));
            flushData();
          } else {
            console.log("next", res);
            dispatch(setMessageTxt(res.data.metadata.message));
            dispatch(setMessageBoxCloseBtn(true));
            flushData();
          }
        })
        .catch((error) => {
          console.log(error);
          dispatch(setMessageTxt(error.data.metadata.message));
          dispatch(setMessageBoxCloseBtn(true));
          flushData();
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const isScheduleFeed = () => {
    try {
      return endDate && startDate ? true : false;
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
        title: shortQuestionContent(title),
        scheduleDate: scheduleDate,
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
                  " but could not send email to selected users."
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
  const sendEmailToNewUsersForFeed = (res) => {
    try {
      addUserOnFeedEmail({
        userIds: taggedUsers.map((item) => item._id),
        communityName: community.name,
        communityId: community?._id,
        communityId: community?._id,
        title: shortQuestionContent(title),
        communityFeedId: res?.data?.data?.feedId,
        appId,
        token,
      })
        .then((emailResponse) => {
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
  const searchUsersByKeywords = (e) => {
    try {
      let patt = new RegExp(e.target.value, "g");
      let allMembs = [...originalMember].filter((item) =>
        patt.test(item.firstName + " " + item.lastName)
      );

      if (allMembs.length > 0) {
        setMembers([...allMembs]);
      } else if (e.target.value.length === 0) {
        setMembers(originalMember);
      } else {
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

      if (keywordVal.search(",") >= 0) {
        let tagsColl = [...topics];

        let inputStr = keywordVal.replace(",", "");

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
    try {
      document.execCommand(command, false, value);
    } catch (error) {
      console.error(error);
    }
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
                let data = item.value.data.data[0].fileToSend;
                coll.push({
                  fileType: findoutFileType(data.Location),
                  fileName: fileInfo[index].name,
                  fileUrl: data.Location,
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

  const removeFileFromAttachcments = (id) => {
    try {
      setAttachments(attachments.filter((item) => item.key !== id));
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    try {
      let abortController = new AbortController();
      let isValidTitle = title && title.length > 0;

      let haCommunityId =
        (community && community._id) ||
        (currentCommunity && currentCommunity._id)
          ? true
          : false;

      let isValidForm = isValidTitle && haCommunityId;
      console.log("Checking Validity", isValidForm);
      setIsValidForm(() => isValidForm);
      return () => {
        abortController.abort();
      };
    } catch (error) {
      console.error(error);
    }
  }, [title, community]);

  useEffect(() => {
    let abortController = new AbortController();
    console.log("currentCommunity", currentCommunity);
    if (communityId != null) {
      // setIsCommunity(() => true);
      setCommunity(() => currentCommunity);
    }
    return () => {
      abortController.abort();
    };
  }, [communityId, currentCommunity]);

  useEffect(() => {
    let abortController = new AbortController();
    if (communityId) {
      // setCommunity(myCommunity.data.find((item) => item._id === communityId));
      let communityUsers;
      if (userRole === "admin") {
        communityUsers = allCommunity.data.find(
          (item) => item._id === communityId
        )?.communityUsers;
      } else {
        communityUsers = myCommunity.data.find(
          (item) => item._id === communityId
        )?.communityUsers;
      }

      if (loadingUsers.length === 0) {
        setLoadingUsers("Loading Users ...");
        getUsersDetail({
          userIds: communityUsers?.map((item) => (item._id ? item._id : item)),
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
  const checkValidate = () => {
    console.log("check alidate");
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
    console.log("Change Commuity", item);
    setCommunity(() => item);
    setTaggedUsers([]);
    setMembers(() => []);
    getAllUsesDetail(
      item?.communityUsers?.map((item) => (item._id ? item._id : item))
    );
    //dispatch(setCommunityId(item._id));
  };
  return (
    <div className="common-box">
      <div className="posting-section-body position-relative">
        <div className="form-row" style={{ position: "relative" }}>
          <small>Community : </small>
          <CustomSelectBox
            data={userRole === "admin" ? allCommunity.data : myCommunity.data}
            onSelected={(item) => changeCommunity(item)}
            selected={community.name}
          />

          <button
            type="button"
            className="btn-close"
            // data-bs-dismiss="modal"
            aria-label="Close"
            style={{ position: "absolute", right: "10px" }}
            onClick={() => dispatch(setPost("welcomebox"))}
          ></button>
          {/* <span>Community : </span>
          <CustomSelectBox
            data={myCommunity.data}
            onSelected={(item) => setCommunity(item)}
            selected={community.name}
          /> */}
        </div>
        <br />
        <div className="card common-card questionPost">
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
            onSetDescription={(val) => setTitle(val)}
            placeholder="Post a Question"
          />
        </div>
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
        <div className="d-flex align-items-center ">
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
          onCreateDiscussionPost={createQuestionPost}
          onFormat={(pass) => format(pass)}
          onSetUrl={() => setUrl()}
          onUploadFiles={(e) => uploadFiles(e)}
          onSetIsTopic={() => setIsTopic(!isTopic)}
          onSetIsStartEndDate={() => setIsStartEndDate(!isStartEndDate)}
          active="question"
        />
      </div>
    </div>
  );
}
export default React.memo(CreateQuestion);
