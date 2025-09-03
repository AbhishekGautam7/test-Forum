import React, { useState } from "react";
import PropTypes from "prop-types";
function CustomSelectBox(props) {
  const [dropStatus, setDropStatus] = useState(false);

  const chooseItem = (item) => {
    setDropStatus(false);
    props.onSelected(item);
  };

  const clearData = () => {
    setDropStatus(false);
    props.onClearCommunity();
  };

  return (
    <div className="cselectbox">
      <div className="selected">
        <span onClick={() => setDropStatus(true)}>
          {props.selected ? props.selected : "Choose community"}
        </span>
        <div className="rightside">
          {dropStatus ? (
            <button className="close">
              <img
                src={
                  process.env.REACT_APP_SITE_URL + "icon-blue-arrow-down.svg"
                }
                width="12"
                onClick={() => setDropStatus(false)}
              />
            </button>
          ) : (
            <button className="down">
              <img
                src={
                  process.env.REACT_APP_SITE_URL + "icon-blue-arrow-down.svg"
                }
                width="12"
                onClick={() => setDropStatus(true)}
              />
            </button>
          )}
        </div>
      </div>

      {dropStatus && (
        <ul>
          {props.showEmpty && props.showEmpty === true && (
            <li onClick={() => clearData()}>None</li>
          )}
          {props.data &&
            props.data.length > 0 &&
            props.data.map((item) => (
              <li key={item._id} onClick={() => chooseItem(item)}>
                {item.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

CustomSelectBox.propTypes = {
  selected: PropTypes.string,
  data: PropTypes.array,
};

export default React.memo(CustomSelectBox);
