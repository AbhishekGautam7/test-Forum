import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changeCommunityDesc } from "../../redux";
import { editCommunityDescription } from "../../api/community";
import AddCommunityDescBox from "./AddCommuniyDescBox";
import { useDispatch } from "react-redux";

function CommunityInfo(props) {
  const infodiv = useRef(null);
  const [isMaxDesc, setIsMaxDesc] = useState(false);
  const [descClass, setDescClass] = useState("");
  const [showReadMore, setShowReadMore] = useState(true);
  const [communityDescBoxStatus, setCommunityDescBoxStatus] = useState(false);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const userId = useSelector((state) => state.info.userId);
  const communityId =  useSelector((state) => state.info.communityId);
  const [isOwnCommunity, setIsOwnCommunity] = useState(false);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const [mode, setMode] = useState("");
  const userRole = useSelector((state) => state.myProfile.data.role);

  const dispatch = useDispatch();
  const expandDescription = () => {
    setShowReadMore(false);
    setDescClass("expand");
  };
  const description = useSelector(
    (state) => state.currentCommunity.data.description
  );
  const collapseDescription = () => {
    setShowReadMore(true);
    setDescClass("");
  };
  const openInfoBox = (mode) => {
    setCommunityDescBoxStatus(true);
    setMode(mode);
  };
  const setCommunityDescription = (content) => {
    console.log(content);
    editCommunityDescription({
      desc: content,
      appId: appId,
      communityId: communityId,
      token: token,
      appId: appId,
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        dispatch(changeCommunityDesc(content));
        setCommunityDescBoxStatus(false);
        setShowReadMore(true);
      }
    });
  };
  useEffect(() => {
  
    setIsOrgAdmin(userRole === "admin");
    setIsOwnCommunity(userId === currentCommunity.createdBy);

    if (infodiv && infodiv.current) {
      if (description.length > 250) {
        setIsMaxDesc(true);
      } else {
        setIsMaxDesc(false);
      }
    }
    setShowReadMore(true);
  }, [description]);
  return (
    <>
      <div className="default-member-box community-info">
        <div className="default-member-title-wrap">
          <span>Info</span>

          {(isOwnCommunity || isOrgAdmin) &&
            description &&
            description.length > 0 && (
              <button className="linkBtn" onClick={() => openInfoBox("edit")}>
                <img src={process.env.REACT_APP_SITE_URL + "icon-edit.svg"} />
              </button>
            )}
        </div>

        {description ? (
          <>
            <div
              className={`infoWrapper ${descClass} ${isMaxDesc ? "max" : ""}`}
            >
              <div ref={infodiv} className="description">
                {showReadMore
                  ? description.slice(0, 250).concat(" ...")
                  : description}
              </div>
            </div>
          </>
        ) : isOwnCommunity || userRole === "admin" ? (
          <div className="click-to-add-content">
            <button className="linkBtn" onClick={() => openInfoBox("add")}>
              <img
                src={process.env.REACT_APP_SITE_URL + "icon-add-round.svg"}
                alt="icon"
              />
            </button>
            <span>Click the button to add information</span>
          </div>
        ) : (
          <div>No description </div>
        )}
        {isMaxDesc && showReadMore && description && description.length > 0 && (
          <button className="readmore linkBtn" onClick={expandDescription}>
            View All
          </button>
        )}
        {isMaxDesc &&
          showReadMore === false &&
          description &&
          description.length > 0 && (
            <button className="readmore linkBtn" onClick={collapseDescription}>
              View less
            </button>
          )}
      </div>{" "}
      {communityDescBoxStatus && (
        <AddCommunityDescBox
          description={description}
          mode={mode}
          onCancel={() => setCommunityDescBoxStatus(false)}
          onSetCommunityDesc={(content) => setCommunityDescription(content)}
        />
      )}
    </>
  );
}

export default React.memo(CommunityInfo);
