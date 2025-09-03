import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
function UserProfileInCommunity(props) {
  const defaultPic = process.env.REACT_APP_SITE_URL + "avatar0.svg";
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const { member } = props;

  useEffect(() => {
    console.log(member);
    setImgUrl(member && member.profilePic ? member.profilePic : defaultPic);

    let firstName =  member && member.firstName ? member.firstName : "";
    let lastName = member && member.lastName ? member.lastName : "";
    setName(firstName + " " + lastName);
    
  });
const showDefaultImg = (e)=>{
  e.target.src=process.env.REACT_APP_SITE_URL + "avatar0.svg";
}
  return (
    <>
      <button className="linkBtn">
        <div className="img-wrap">
          <img src={imgUrl} alt={name} title={name} loading="lazy" onError={(e)=>showDefaultImg(e)} />
          {member._id === currentCommunity.createdBy && (
          <div className="star">
            <span>
              <img src={process.env.REACT_APP_SITE_URL + "white-star.png"} />
            </span>
          </div>
        )}
        </div>
        
        <span alt={name} title={name}>{name.length > 10 ? name.substring(0, 9) + "..." : name}</span>
      </button>
    </>
  );
}

export default React.memo(UserProfileInCommunity);
