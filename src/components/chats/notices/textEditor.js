import React, { useRef, useEffect } from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
} from "react-icons/md";
import { FaLink } from "react-icons/fa";

const TextEditor = ({ content, setContent }) => {
  const customEditor = useRef(null);

  console.log({ content });

  // useEffect(() => {
  //   customEditor.current.addEventListener("paste", function (e) {
  //     e.preventDefault();
  //     var text = e.clipboardData.getData("text/plain");
  //     document.execCommand("insertText", false, text);
  //   });

  //   // customEditor.current.innerHTML = "<ul><li>dsa</li></ul>";
  //   // customEditor.current.innerHTML = content;

  //   if (content) {
  //     // customEditor.current.innerHTML = content;
  //   }
  // }, [content]);

  const execCmd = (command, value = null) => {
    console.log({ command, value });

    if (customEditor.current) {
      customEditor.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const handleInputChange = (e) => {
    setContent(e.target.innerHTML);
  };

  // const addLink = () => {
  //   const url = prompt("Enter the URL");
  //   if (url) {
  //     document.execCommand("createLink", false, url);
  //   }
  // };

  return (
    <div>
      <div className="KK-editor-toolbar">
        <div className="KK-editor-first">
          <button title="bold" onClick={() => execCmd("bold")}>
            <MdFormatBold size={22} />
          </button>
          <button title="italic" onClick={() => execCmd("italic")}>
            <MdFormatItalic size={22} />
          </button>
          <button title="underline" onClick={() => execCmd("underline")}>
            <MdFormatUnderlined size={22} />
          </button>
          {/* <button onClick={addLink}>
          <FaLink />
        </button> */}
        </div>
        {/* <button
          title="Ordered List"
          className="linkBtn"
          onClick={() => execCmd("insertorderedlist")}
        >
          <img
            src={process.env.REACT_APP_SITE_URL + "icon-number-points.svg"}
            alt="icon"
            loading="lazy"
          />
        </button>
        <button
          title="Unordered List"
          className="linkBtn"
          onClick={() => execCmd("insertunorderedlist")}
        >
          <img
            src={process.env.REACT_APP_SITE_URL + "icon-bullet-points.svg"}
            alt="icon"
            loading="lazy"
          />
        </button> */}
        {/* 
        <button onClick={() => execCmd("insertUnorderedList")}>
          <img
            src={process.env.REACT_APP_SITE_URL + "icon-bullet-points.svg"}
            alt="icon"
            loading="lazy"
          />
        </button>
        <button onClick={() => execCmd("insertOrderedList")}>
          <img
            src={process.env.REACT_APP_SITE_URL + "icon-number-points.svg"}
            alt="icon"
            loading="lazy"
          />
        </button> */}

        <div className="KK-editor-second">
          <select
            onChange={(e) => execCmd("fontSize", e.target.value)}
            className="KK-editor-select"
          >
            <option value="" selected disabled="disabled">
              Size
            </option>
            <option value="1">8px</option>
            <option value="2">10px</option>
            <option value="3">12px</option>
            <option value="4">14px</option>
            <option value="5">18px</option>
            <option value="6">24px</option>
            <option value="7">36px</option>
          </select>
        </div>
      </div>
      <div
        ref={customEditor}
        className="KK-editor"
        contentEditable="true"
        onInput={handleInputChange}
        // onChange={(e) => {
        //   e.preventDefault();
        //   setContent(customEditor.current.innerHTML);
        // }}
        // dangerouslySetInnerHTML={{
        //   __html: customEditor?.current ? customEditor?.current?.innerHTML : "",
        // }}
      ></div>
    </div>
  );
};

export default TextEditor;
