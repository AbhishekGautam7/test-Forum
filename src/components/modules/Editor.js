import React, { useEffect, useRef } from "react";

function Editor({ description, onSetDescription, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    // Keep textarea value in sync with description prop
    if (textareaRef.current && textareaRef.current.value !== description) {
      textareaRef.current.value = description || "";
    }
  }, [description]);

  const handleChange = (e) => {
    if (onSetDescription) onSetDescription(e.target.value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const { selectionStart, selectionEnd } = e.target;
    const newValue =
      (description || "").substring(0, selectionStart) +
      text +
      (description || "").substring(selectionEnd);
    if (onSetDescription) onSetDescription(newValue);
  };

  return (
    <textarea
      ref={textareaRef}
      className="editor"
      placeholder={placeholder || "Start a discussion"}
      onChange={handleChange}
      onPaste={handlePaste}
      rows={5} // optional
      value={description || ""}
    />
  );
}

export default React.memo(Editor);
