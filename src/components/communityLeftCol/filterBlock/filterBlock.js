import React from "react";

import {
  TickIcon,
  PublicIcon,
  PrivateIcon,
  FavouriteIcon,
  CommunityAdminIcon,
} from "../../icons";

const FilterBlock = ({
  isJoined,
  isFavourite,
  isCommunityAdmin,
  isPublicOrPrivate,
  setIsJoined,
  setIsFavourite,
  setIsCommunityAdmin,
  setIsPublicOrPrivate,
}) => {
  return (
    <div className="filter-wrapper">
      <div
        className="filter-icon"
        title="Favorite communities"
        onClick={() => setIsFavourite((prev) => !prev)}
      >
        <FavouriteIcon color={isFavourite ? "#007b3b" : "#bebebe"} />
      </div>

      <div
        className="filter-icon"
        title="Public communities"
        onClick={() =>
          isPublicOrPrivate === "" || isPublicOrPrivate === "Private"
            ? setIsPublicOrPrivate("Public")
            : setIsPublicOrPrivate("")
        }
      >
        <PublicIcon
          color={isPublicOrPrivate === "Public" ? "#007b3b" : "#bebebe"}
        />
      </div>

      <div
        className="filter-icon"
        title="Private communities"
        onClick={() =>
          isPublicOrPrivate === "" || isPublicOrPrivate === "Public"
            ? setIsPublicOrPrivate("Private")
            : setIsPublicOrPrivate("")
        }
      >
        <PrivateIcon
          color={isPublicOrPrivate === "Private" ? "#007b3b" : "#bebebe"}
        />
      </div>

      <div
        className="filter-icon"
        title="Community admin"
        onClick={() => setIsCommunityAdmin((prev) => !prev)}
      >
        <CommunityAdminIcon color={isCommunityAdmin ? "#007b3b" : "#bebebe"} />
      </div>

      <div
        className="filter-icon"
        title="Joined communities"
        onClick={() => setIsJoined((prev) => !prev)}
      >
        <TickIcon color={isJoined ? "#007b3b" : "#bebebe"} />
      </div>
    </div>
  );
};

export default FilterBlock;
