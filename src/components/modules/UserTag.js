import React, { useState,useRef,useEffect } from "react";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
function UserTag(props) {
  const txtBox = React.useRef(null);
  const {
    members,
    onSearchUsersByKeywords,
    taggedUsers,
    onTagUser,
    onRemoveUserTag,
    status
  } = props;
  const [dropDownStatus, setDropDownStatus] = useState(false);
 const userId = useSelector(state=>state.info.userId)
  const tagUser = (item) => {
    setDropDownStatus(() => true);
    onTagUser(item);
    txtBox.current.value="";
  };
  const searchUserByKeywords = (e) => {
    setDropDownStatus(() => true);
    onSearchUsersByKeywords(e);
  };
  const isTaggedUser = (obj) => {
    return taggedUsers.find((item) => item._id === obj._id) || obj._id === userId ? "disabled" : "";
  };
  const removeTagsBox = (item)=>{
    onRemoveUserTag(item);
    txtBox.current.value="";
  }
  const closeDropDown = ()=>{
    setDropDownStatus(false);
    txtBox.current.value="";
  }
  const searchUsers =(e)=>{
    onSearchUsersByKeywords(e);
    setDropDownStatus(true);
  }
  useEffect(()=>{
    setDropDownStatus(status ? status : false);
    console.log("ti");
  },[status])
  return (
    <div className="posting-add-people">
      {taggedUsers &&
        taggedUsers.length > 0 &&
        taggedUsers.map((item) => {
          return (
            <div className="select-member-badge" key={item._id}>
            
              <div className="text-wrap">
                <span>{item.name ? item.name : (item.firstName && item.lastName) ? item.firstName +" " + item.lastName : ""}</span>
              </div>
              <button
                className="select-close-icon"
              
                onClick={() => removeTagsBox(item)}
              >
                <img
                  src={process.env.REACT_APP_SITE_URL + "icon-blue-close.svg"}
                  alt="close-icon"
                />
              </button>
            </div>
          );
        })}
      <div className="adduser">
        <button className="add-people-icon linkBtn"  onClick={(e) => searchUserByKeywords(e)}>
          <img
            src={
              process.env.REACT_APP_SITE_URL + "icon-community-add-people.svg"
            }
            alt="icon"
            loading="lazy"
          />
        </button>
        <div className="select-member-holder">
          <div className="select-member">
            <div className="input-selected-wrap">
              <input
                ref={txtBox}
                type="text"
                className="form-control common-form-control"
                placeholder="Add People"
                onKeyUp={(e) => searchUsers(e)}
               
              />
            </div>
          </div>
        
          {dropDownStatus && members && members.length > 0 && (
            <div className="selectMember">
              <button
                className="closeBtn"
                href="#"
                loading="lazy"
                
                onClick={() => closeDropDown()}
              >
                <img
                  src={process.env.REACT_APP_SITE_URL + "icon-close.svg"}
                  alt="close-icon"
                />
              </button>
             
              <ul
                style={{ display: "block" }}
                id="peoplerDropdown"
                className="select-member-drop scrollbar-wrap"
              >
                {members &&
                  members.length > 0 &&
                  members.map((item) => {
                    return (
                      <li
                        onClick={() => tagUser(item)}
                        key={item._id}
                        className={isTaggedUser(item)}
                      >
                        <img
                          src={item.profilePic ? item.profilePic : process.env.REACT_APP_SITE_URL+"avatar0.svg"}
                          alt="member"
                          loading="lazy"
                        />
                        <div className="text-wrap">
                          <h4>{item.name ? item.name : (item.firstName && item.lastName) ? item.firstName +" " + item.lastName : ""}</h4>
                          <span>{item.email ? item.email : ""}</span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
UserTag.propTypes = {
  searchUsersByKeywords: PropTypes.func,
  onTagUser: PropTypes.func,
  members: PropTypes.array,
  taggedUsers: PropTypes.array,
  onRemoveUserTag: PropTypes.func,
};
export default React.memo(UserTag);
