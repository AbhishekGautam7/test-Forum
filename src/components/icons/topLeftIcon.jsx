import React from "react";

const TopLeftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 22 22"
      style={{ display: "block", padding: 0, margin: 0 }}
    >
      <g fill="none" stroke="#FFF" strokeWidth="1">
        <path d="M2.5 10L0 10 0 0 10 0 10 2.5" />
        <path d="M0 5.769L0 0 5.769 0" transform="translate(6 6)" />
        <path d="M0 5.769L0 0 5.769 0" transform="translate(6 6)" />
        <path d="M6 16.734L6 22 22 22 22 6 16.734 6" />
        <path d="M16.734 6L22 6 22 22 6 22 6 16.734M6 6L18 18" />
      </g>
    </svg>
  );
};

export default TopLeftIcon;
