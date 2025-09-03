import React from "react";

import Switch from "react-switch";

const SettingToggle = ({
  disabled = false,
  label,
  description,
  name,
  setFieldValue,
  value,
  className,
  muteAllHandler,
}) => {
  return (
    <div className="toggle-container">
      <div
        className={`group-setting-item-container ${className ? className : ""}`}
        // style={{ marginLeft: "1rem" }}
      >
        <div
          className="d-flex flex-column group-setting-item"
          style={{ flex: 1 }}
        >
          <strong className="text-capitalize">{label}</strong>
          <small>{description}</small>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <Switch
            onChange={(checked) =>
              name === "muteAll"
                ? muteAllHandler(checked)
                : setFieldValue(name, checked)
            }
            checkedIcon={false}
            uncheckedIcon={false}
            checked={value}
            disabled={disabled}
            onColor="#386cbb"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingToggle;
