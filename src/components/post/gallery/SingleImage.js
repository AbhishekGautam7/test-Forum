import React, { useState, useRef } from "react";
function SingleImage(props) {
  const [size, setSize] = useState("");
  const pic = useRef(null);
  const findSize = (e) => {
    if (e.target.width > e.target.height) {
      setSize("landscape");
    } else if (e.target.width < e.target.height) {
      setSize("portait");
    } else {
      setSize("square");
    }
  };
  return (
    <div
      // className={`singleImage ${size}`}
      onClick={() => props.onIndex(0)}
      style={{
        maxHeight: "500px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        className="frontImg"
        src={props.src}
        title={props.name}
        onLoad={(e) => findSize(e)}
        style={{
          objectFit: "contain",
          position: "relative",
          maxHeight: "500px",
          zIndex: 2,
        }}
      />
      <img
        // className="backImg"
        src={props.src}
        title={props.name}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          objectFit: "cover",
          filter: "blur(10px)",
          WebkitFilter: "blur(10px)",
        }}
      />
    </div>
  );
}

export default React.memo(SingleImage);
