import React from "react";
function UserPic(props) {
  const {name,src } = props;
  const defaultPic = process.env.REACT_APP_SITE_URL + "avatar0.svg";
  return <img src={src ? src : defaultPic} alt={name} title={name} />;
}

export default React.memo(UserPic);
