import React from "react";
import PropTypes from "prop-types";
function Tag(props) {
  return (
    <>
      <ul className="tagsKey">
        {props.tags &&
          props.tags.length > 0 &&
          props.tags.map((item, index) => {
            return (
              item.length > 0 && (
                <li key={index} className="select-member-badge">
                  <span>{item}</span>{" "}
                  <button
                    className="select-close-icon"
                    onClick={() => props.onRemoveTag(item)}
                    type="button"
                  >
                    <img
                      src={process.env.REACT_APP_SITE_URL + "icon-close.svg"}
                      alt="close-icon"
                    />
                  </button>
                </li>
              )
            );
          })}
      </ul>

      <input
        type="text"
        className="form-control"
        id="communityName"
        aria-label="Morning Vibes"
        value={props.tagNames}
        onChange={(e) => props.onSetMyTags(e)}
        autoComplete={"off"}
      />
    </>
  );
}
Tag.propTypes = {
  tags: PropTypes.array,
  tagNames: PropTypes.string,
};
export default React.memo(Tag);
