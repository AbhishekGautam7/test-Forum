import React from "react";
import LeftCol from "../components/LeftCol";
import MessageBox from "../components/modules/MessageBox";
import { useSelector } from "react-redux";
import SearchPage from "../components/search";
import { useDispatch } from "react-redux";
import { setSearchBoxStatus } from "../redux";
import CommunityLeftCol from "../components/communityLeftCol";

function Search() {
  const info = useSelector((state) => state.info);
  const messageBox = useSelector((state) => state.messageBox);
  let { isModal } = info;
  const dispatch = useDispatch();

  const hidePop = () => {
    dispatch(setSearchBoxStatus(false));
  };
  return (
    <>
      <div className="main-wrapper" part="main-wrapper">
        <div className="row equal-height-row">
          {/* <LeftCol /> */}

          <CommunityLeftCol />

          <div
            className="col-xs-12 col-lg-12 col-xl-9 community-overview-content"
            onClick={() => hidePop()}
          >
            <SearchPage />
          </div>

          {messageBox.status && <MessageBox />}
        </div>
      </div>

      {isModal === true ? <div className="modal-backdrop fade show"></div> : ""}
    </>
  );
}

export default React.memo(Search);
