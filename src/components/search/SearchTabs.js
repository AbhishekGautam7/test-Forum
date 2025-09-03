import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchTab, setLoadSearchResult } from "../../redux";
function SearchTabs() {
  const communityList = useSelector((state) => state.search.communityList);
  const tab = useSelector((state) => state.search.tab);
  const totalFeed = useSelector((state) => state.feeds.total);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const search = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const setCommunityCount = () => {
    try {
      if (userRole === "user") {
        return communityList.length;
      } else if (userRole === "admin") {
        return search?.communityList?.length;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const triggerConversationTab = () => {
    dispatch(setSearchTab("conversations"));
    dispatch(setLoadSearchResult(false));
  };

  const triggerCommunityTab = () => {
    dispatch(setSearchTab("communities"));
    dispatch(setLoadSearchResult(false));
  };

  return (
    <div className="discover-community-navbar search-results-navbar">
      <ul className="default-nav-list">
        <li>
          <button
            className={tab === "conversations" ? "active" : ""}
            onClick={() => triggerConversationTab()}
          >
            Conversations
          </button>
          <span className="search-count">{totalFeed}</span>
        </li>

        <li>
          <button
            className={tab === "communities" ? "active" : ""}
            onClick={() => triggerCommunityTab()}
          >
            Communities
          </button>
          <span className="search-count">{setCommunityCount()}</span>
        </li>
      </ul>
    </div>
  );
}

export default SearchTabs;
