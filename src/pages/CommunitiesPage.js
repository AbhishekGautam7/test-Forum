import React from "react";
import LeftCol from "../components/LeftCol";
import MessageBox from "../components/modules/MessageBox";
import { useSelector } from "react-redux";
import Communities from "../components/Communities";
import CommunityLeftCol from "../components/communityLeftCol/communityLeftCol";

function CommunitiesPage() {
  const info = useSelector((state) => state.info);
  const messageBox = useSelector((state) => state.messageBox);
  let { isModal } = info;

  return (
    <>
      <div className="main-wrapper" part="main-wrapper">
        <div className="row equal-height-row">
          {/* <LeftCol /> */}

          <CommunityLeftCol />

          <div className="col-xs-12 col-lg-12 col-xl-9 community-overview-content">
            <Communities />
          </div>

          {messageBox.status && <MessageBox />}
        </div>
      </div>

      {isModal === true ? <div className="modal-backdrop fade show"></div> : ""}
    </>
  );
}

export default React.memo(CommunitiesPage);
