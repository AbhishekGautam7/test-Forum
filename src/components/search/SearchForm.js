import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomSelectBox from "../modules/CustomSelectBox";
import {DayPicker} from "react-day-picker";
import {
  advanceSearchCommunity,
  advanceSearchConversations,
} from "../../api/community";
import { getAllCommunity } from "../../api/orgAdmin";
import {
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setSearchCommunityList,
  setFeeds,
  setSearchKeyword,
  setSearchType,
  setSearchTo,
  setSearchFrom,
  setSearchCommunityId,
  setFeedIdList,
  hasMoreFeed,
  setFeedsName,
  setTotalFeed,
  setAllCommunity,
} from "../../redux";

// Or import the input component

function SearchForm() {
  const [selectedFromDay, setselectedFromDay] = useState(null);
  const [selectedToDay, setselectedToDay] = useState(null);
  const [datePickerStatus, setDatePickerStatus] = useState(false);
  const [validateForm, setValidateForm] = useState(false);
  const [dateValidation, setDateValidation] = useState(true);
  const [activeDate, setActiveDate] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [afterDate, setAfterDate] = useState(new Date());
  const [beforeDate, setBeforeDate] = useState(new Date());
  const allCommuities = useSelector((state) => state.allCommunity.data);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const tab = useSelector((state) => state.search.tab);
  const mycommunity = useSelector((state) => state.myCommunity.data);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const count = useSelector((state) => state.feeds.perPageFeed);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const dateHandler = (e) => {
    setDatePickerStatus(true);
    setActiveDate(e.target.name);
  };
  const changeFromDate = (e) => {
    if (e.target.value.length === 0) {
      setselectedFromDay(null);
    }
  };

  const changeToDate = (e) => {
    if (e.target.value.length === 0) {
      setselectedToDay(null);
    }
  };

  const handleDayClick = (day) => {
    try {
      setDatePickerStatus(false);

      if (activeDate === "from") {
        setselectedFromDay(day);
      } else {
        setselectedToDay(day);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const searchData = () => {
    try {
      // advanceSearchCommunity
      dispatch(setSearchType("public"));
      dispatch(setMessageBox(true));
      dispatch(setSearchTo(selectedToDay));
      dispatch(setSearchFrom(selectedFromDay));
      dispatch(setSearchKeyword(keyword));
      dispatch(setMessageBoxCloseBtn(false));

      if (tab === "communities") {
        dispatch(setMessageTxt("Loading Communities ..."));

        advanceSearchCommunity({
          keyword: keyword,
          from: selectedFromDay && selectedToDay ? selectedFromDay : null,
          to: selectedFromDay && selectedToDay ? selectedToDay : null,
          tab: tab,
          count: count,
          appId,
          token,
          isOrgAdmin: userRole === "admin",
        }).then((response) => {
          advanceSearchConversations({
            communityId: selectedCommunityId,
            keyword: keyword,
            from: selectedFromDay && selectedToDay ? selectedFromDay : null,
            to: selectedFromDay && selectedToDay ? selectedToDay : null,
            tab: tab,
            appId,
            token,
            count: count,
            status: userRole === "admin" ? "all" : "live",
          }).then((res) => {
            dispatch(setFeeds(res.list));
            dispatch(setFeedIdList(res.list.map((item) => item._id)));
            dispatch(hasMoreFeed(res.metadata.hasMore));
            dispatch(setSearchCommunityList(response));
            dispatch(setFeedsName("publicKeywordAdvanceSearchConversation"));
            dispatch(setTotalFeed(res.metadata.totalCount));
            setselectedFromDay(null);
            setselectedToDay(null);
            setSelectedCommunityId(null);
            setKeyword("");
            dispatch(setMessageBox(false));
          });
        });
      } else if (tab === "conversations") {
        dispatch(setMessageTxt("Loading Conversation feeds ..."));

        dispatch(setSearchCommunityId(selectedCommunityId));
        advanceSearchConversations({
          communityId: selectedCommunityId,
          keyword: keyword,
          from: selectedFromDay && selectedToDay ? selectedFromDay : null,
          to: selectedFromDay && selectedToDay ? selectedToDay : null,
          tab: tab,
          status: userRole === "admin" ? "all" : "live",
          appId,
          token,
        }).then((response) => {
          dispatch(setFeeds(response.list));
          dispatch(setFeedIdList(response.list.map((item) => item._id)));
          dispatch(hasMoreFeed(response.metadata.hasMore));
          dispatch(setFeedsName("publicKeywordAdvanceSearchConversation"));
          dispatch(setTotalFeed(response.metadata.totalCount));

          advanceSearchCommunity({
            keyword: keyword,
            from: selectedFromDay && selectedToDay ? selectedFromDay : null,
            to: selectedFromDay && selectedToDay ? selectedToDay : null,
            tab: tab,
            appId,
            token,
          }).then((res) => {
            dispatch(setFeeds(response.list));
            dispatch(setSearchCommunityList(res));
            setselectedFromDay(null);
            setselectedToDay(null);
            setSelectedCommunityId(null);
            setKeyword("");
            dispatch(setMessageBox(false));
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Validate Date of From and To date
  useEffect(() => {
    let validKeyword = false;
    let validDate = true;

    if (selectedFromDay && !selectedToDay) {
      setDateValidation(false);
      validDate = false;
    } else if (!selectedFromDay && selectedToDay) {
      setDateValidation(false);
      validDate = false;
    } else if (!selectedFromDay && !selectedToDay) {
      setDateValidation(true);
      validDate = true;
    } else if (selectedFromDay && selectedToDay) {
      if (selectedFromDay > selectedToDay) {
        dispatch(setMessageBox(true));
        dispatch(setMessageTxt("From Date must not be greater than To Date"));
        dispatch(setMessageBoxCloseBtn(true));
        validDate = false;
        setDateValidation(false);
      } else {
        validDate = true;
        setDateValidation(true);
      }
    }

    if (keyword.length > 0) {
      validKeyword = true;
    } else {
      validKeyword = false;
    }

    if (validKeyword && validDate) {
      setValidateForm(true);
    } else {
      setValidateForm(false);
    }
  }, [selectedFromDay, selectedToDay, keyword]);

  // Referesh form when tab changed
  useEffect(() => {
    setselectedFromDay(null);
    setselectedToDay(null);
    setSelectedCommunityId(null);
    setKeyword("");

    // afterDate,setAfterDate
    let afterdate = new Date();
    afterdate.setHours(23);
    afterdate.setMinutes(59);
    afterdate.setMilliseconds(59);
    setAfterDate(afterdate);

    let beforeyear = new Date().getFullYear() - 2;

    setBeforeDate(new Date(beforeyear, 1, 1));
  }, [tab]);

  const queryAllCommunity = async () => {
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
        token,
        appId,
      };

      await getAllCommunity(payload)
        .then((res) => {
          dispatch(setAllCommunity(res));
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let abortController = new AbortController();

    // Get all Communities and we do not need to search for admin becuase it is already in redux store
    if (userRole === "admin") {
      /* Need to query all communities */
      queryAllCommunity();
    } else {
      /* Need to query private communities */
      dispatch(setAllCommunity(mycommunity));
    }

    return () => {
      abortController.abort();
    };
  }, []);
  const openMessage = () => {
    try {
      let txt = "";
      if (tab === "conversations") {
        //  dispatch(setMessageTxt("Search by keyword and tags in Communities you are part of and Public community"));
        txt =
          "Search by keyword and tags in Communities you are part of and Public community";
      } else if (tab === "communities") {
        txt = "Search for Public and Communities you are part of";
      }
      return txt;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="common-box">
      <div className="advanced-search-form">
        <h2>
          Advanced Search {tab}{" "}
          <button title={openMessage()} className="linkBtn">
            <img
              src={process.env.REACT_APP_SITE_URL + "icon-black-question.svg"}
            />
          </button>
        </h2>

        <div className="line"></div>
        <div className="mb-3">
          <label htmlFor="searchFor" className="form-label">
            Search for
          </label>
          <input
            type="text"
            className="form-control"
            id="searchFor"
            value={keyword}
            aria-label="Training for students"
            onChange={(e) => setKeyword(e.target.value)}
            autoComplete="off"
            ref={searchInput}
          />
        </div>
        {tab === "conversations" && (
          <div className="select-member-holder mb-3">
            <label htmlFor="membersSearch" className="form-label">
              In
            </label>

            <CustomSelectBox
              data={allCommuities}
              selected={
                selectedCommunityId
                  ? allCommuities.find(
                      (item) => item._id === selectedCommunityId
                    ).name
                  : "Choose Community"
              }
              showEmpty={true}
              onClearCommunity={() => setSelectedCommunityId(null)}
              onSelected={(item) => setSelectedCommunityId(item._id)}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <input
                type="text"
                name="from"
                autoComplete="off"
                value={
                  selectedFromDay ? selectedFromDay.toLocaleDateString() : ""
                }
                onClick={(e) => dateHandler(e)}
                onChange={(e) => changeFromDate(e)}
                className="form-control"
                placeholder="From"
                aria-label="From"
              />
            </div>
            <div className="col-auto">
              <input
                type="text"
                name="to"
                value={selectedToDay ? selectedToDay.toLocaleDateString() : ""}
                onClick={(e) => dateHandler(e)}
                className="form-control"
                placeholder="To"
                aria-label="To"
                autoComplete="off"
                onChange={(e) => changeToDate(e)}
              />
            </div>
            {datePickerStatus === true && (
              <div className="datePickerWrapper">
                <div className="close">
                  <button onClick={() => setDatePickerStatus(false)}></button>
                </div>
                <DayPicker
                  onDayChange={(mdate) => console.log(mdate)}
                  selectedDays={selectedToDay ? selectedToDay : new Date()}
                  onDayClick={handleDayClick}
                  disabledDays={[
                    {
                      after: afterDate,
                      before: beforeDate,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
        {dateValidation === false && (
          <div className="errorMsg">
            Both From Date and To Date are mandatory, if date option is
            selected.
          </div>
        )}
        <button
          onClick={() => searchData()}
          className="common-community-btn"
          disabled={!validateForm}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchForm;
