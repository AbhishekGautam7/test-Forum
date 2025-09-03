import React from "react";

const PushNotification = ({ title, body }) => {
  return (
    <div className="notification">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
};

export default PushNotification;
