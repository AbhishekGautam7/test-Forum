import PropTypes from "prop-types";
import React from "react";

function LoadingMessageBox(props) {
  return (
    <div className="loadingBox">
      <h3>{props.title}</h3>
      {props.buttonStatus && (
        <button onClick={() => props.onStatus(false)}>OK</button>
      )}
    </div>
  );
}

LoadingMessageBox.propTypes = {
  title: PropTypes.string,
  buttonStatus: PropTypes.bool,
};
export default React.memo(LoadingMessageBox);
