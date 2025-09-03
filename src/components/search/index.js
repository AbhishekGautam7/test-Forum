import React from "react";
import SearchHeader from "./SearchHeader";
import SearchTabs from "./SearchTabs";
import { useSelector } from "react-redux";
import Conversations from "./Conversations";
import Communities from "./Communities";
import SearchForm from "./SearchForm"

function SearchPage() {
  const tab = useSelector((state) => state.search.tab);


  return (
    <>
      <SearchHeader /> 
      <div className="row">
        <div className="col-lg-8">
          <SearchTabs />
         
          {tab === "conversations" ? (
            <Conversations />
          ) : tab === "communities" ? (
            <Communities />
          )  :(
            ""
          )}
        </div>
        <div className="col-lg-4">
          <SearchForm />
        </div>
      </div>
    </>
  );
}

export default SearchPage;
