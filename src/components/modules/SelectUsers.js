import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
function SelectUsers(props) {
  const [memberStatus, setMemberStatus] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const members = JSON.parse(props.members);
  const searchInput = React.useRef(null);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const createdBy = useSelector(
    (state) => state.currentCommunity.data.createdBy
  );
  const liClass = (item) => {
    try {
      if (
        selectedMembers &&
        selectedMembers.length > 0 &&
        selectedMembers.filter((mem) => mem.id === item.id).length > 0
      ) {
        return "listli disabled";
      } else {
        return "listli";
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addSelectedMembers = (item) => {
    try {
      if (selectedMembers && selectedMembers.length === 0) {
        setSelectedMembers(() => [item]);
        props.onSelected([item]);
      } else if (
        selectedMembers &&
        selectedMembers.length > 0 &&
        selectedMembers.filter((mem) => mem.id === item.id).length === 0
      ) {
        setSelectedMembers(() => [...selectedMembers, item]);
        props.onSelected([...selectedMembers, item]);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeMember = (item) => {
    try {
      let obj = selectedMembers.find((mem) => mem.id === item.id);
      let index = selectedMembers.indexOf(obj);
      let mem = [...selectedMembers];
      mem.splice(index, 1);

      setSelectedMembers(() => mem);
      props.onSelected(mem);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    try {
      console.log(currentCommunity);
      if (props.selected) {
        setSelectedMembers(props.selected);
      }
    } catch (error) {
      console.error(error);
    }
  }, [props]);
  return (
    <div className="selectMembers" id={props.id ? props.id : "selectMembers"}>
      <div className="select-member">
        <div className="input-selected-wrap">
          {selectedMembers && selectedMembers.length > 0
            ? selectedMembers.map((item) => {
                return (
                  <div className="select-member-badge" key={item.id}>
                    {item && item.img ? (
                      <img
                        src={item.img}
                        alt="user"
                        className="pic"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={process.env.REACT_APP_SITE_URL + "avatar0.svg"}
                        width="25"
                        height="25"
                        className="avatar"
                      />
                    )}

                    <div className="text-wrap">
                      <span>{item.name}</span>
                    </div>
                    {createdBy !== item.id && (
                      <button
                        className="select-close-icon"
                        loading="lazy"
                        onClick={() => removeMember(item)}
                      >
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL + "icon-close.svg"
                          }
                          alt="close-icon"
                        />
                      </button>
                    )}
                  </div>
                );
              })
            : ""}

          <input
            type="text"
            className="form-control common-form-control"
            placeholder="Search users with keywords..."
            onKeyUp={(e) => props.onSortingMember(e)}
            onClick={() => setMemberStatus(true)}
            id="searchmembers"
            ref={searchInput}
            autoComplete="off"
          />
        </div>
      </div>

      {memberStatus &&
      memberStatus === true &&
      members &&
      members.length > 0 ? (
        <>
          <div className="selectMember">
            {!props.inviteBtn ? (
              <button
                className="closeBtn"
                href="#"
                loading="lazy"
                onClick={() => setMemberStatus(false)}
              >
                <img
                  src={process.env.REACT_APP_SITE_URL + "icon-close.svg"}
                  alt="close-icon"
                />
              </button>
            ) : (
              ""
            )}
            {members && members.length > 0 && (
              <ul
                className="select-member-drop scrollbar-wrap show-content"
                style={{ display: "block" }}
              >
                {members.map((item) => {
                  return (
                    <li
                      onClick={() => addSelectedMembers(item)}
                      key={item.id}
                      className={liClass(item)}
                    >
                      {item && item.img ? (
                        <img
                          src={item.img}
                          alt="img"
                          className="pic"
                          loading="lazy"
                        />
                      ) : (
                        <img
                          src={process.env.REACT_APP_SITE_URL + "avatar0.svg"}
                          width="25"
                          height="25"
                          className="avatar"
                        />
                      )}

                      <div className="text-wrap">
                        <h4>{item.name}</h4>
                        <span>{item.email}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : (
        ""
      )}
      {props.inviteBtn && (
        <div className="btns">
          <button
            className="inviteBtn"
            onClick={() =>
              props.onInviteUsers(selectedMembers.map((item) => item.id))
            }
          >
            Invite Users
          </button>
          <button className="closeButton" onClick={() => props.closeBox()}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

SelectUsers.propTypes = {
  members: PropTypes.string,
  onSelected: PropTypes.func,
  id: PropTypes.string,
  onInviteUsers: PropTypes.func,
};
export default React.memo(SelectUsers);
