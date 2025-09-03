import React from "react";
import UserPic from "./UserPic";
function MemberList(props) {
  const { data } = props;
  return (
    <>
  
    <ul className="communities-members-list">
      {data.map((item, index) => {
        return (
          index < 5 && item && (
            <li key={index}>
              <UserPic id={item} src={item && item?.profilePic ? item?.profilePic : null} name={item?.firstName + " " + item?.lastName} />
            </li>
          )
        );
      })}
    </ul>
    </>
  );
}
export default React.memo(MemberList);
