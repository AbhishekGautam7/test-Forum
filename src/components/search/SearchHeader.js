import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
function SearchHeader() {
  const keyword = useSelector((state) => state.search.keyword);
  const communityList = useSelector((state) => state.search.communityList);

  const feeds = useSelector((state) => state.feeds.data);
  const totalFeed = useSelector((state) => state.feeds.total);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    let tot = communityList?.length + totalFeed;
    setTotal(tot);
  }, [communityList, feeds, totalFeed]);
  return (
    <div className="search-results-header">
      <h2>Search Results</h2>
      <p>
        {total} Search for <span>“{keyword}”</span>
      </p>
    </div>
  );
}

export default SearchHeader;
