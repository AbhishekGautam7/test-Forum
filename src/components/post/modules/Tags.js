import React from "react";
import { getFeedByTag } from "../../../api/community";
import { useSelector, useDispatch } from "react-redux";
import {
  setFeeds,
  setMessageBox,
  setMessageTxt,
  setMessageBoxCloseBtn,
  setFeedsName,
  setTag,
  setCurrentFeedId,
  setFeedIdList,
  hasMoreFeed,
  setTotalFeed,
} from "../../../redux";
import { getStatus } from "../../../libary/global";
function Tags(props) {
  const { feedId } = props;
  const communityId = useSelector((state) => state.currentCommunity.data._id);
  const currentCommunity = useSelector((state) => state.currentCommunity);
  const communityHeaderTab = useSelector(
    (state) => state.info.communityHeaderTab
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const page = useSelector((state) => state.info.page);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.myProfile.data.role);
  const feed = useSelector((state) =>
    state.feeds.data.find((item) => item._id === feedId)
  );
  // userRole,page,feed,communityHeaderTab

  const fetchFeedByTag = (tag) => {
    dispatch(setMessageBox(true));
    dispatch(setMessageBoxCloseBtn(false));
    dispatch(setMessageTxt("Searching feeds with tag of #" + tag));
    dispatch(setFeedsName("tagsearch"));
    dispatch(setTag(tag));
    dispatch(setCurrentFeedId(feedId));

    let payload = {
      keyword: tag,
      appId,
      token,
    };
    if (userRole === "admin" && (page === "home" || page === "search")) {
      payload.status = "all";
    } else {
      payload.status = getStatus({
        userRole,
        page,
        feed,
        communityHeaderTab,
      });
    }
    if (communityId) {
      payload.communityId = communityId;
    }

    console.log(currentCommunity.data._id);
    console.log(communityId);
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
        dispatch(setMessageBox(false));
        dispatch(setMessageBoxCloseBtn(true));
        dispatch(setMessageTxt(""));
        dispatch(setFeedIdList(response.list.map((item) => item._id)));
        dispatch(hasMoreFeed(response.metadata.hasMore));
        dispatch(setTotalFeed(response.metadata.totalCount));
        window.scrollTo(0, 0);
      }
    });
  };
  return (
    <div className="tag-content">
      {props &&
        props.data &&
        props.data.length > 0 &&
        props.data.map((item) => {
          return (
            <button key={item} onClick={() => fetchFeedByTag(item)}>
              #{item}
            </button>
          );
        })}
    </div>
  );
}
export default React.memo(Tags);
