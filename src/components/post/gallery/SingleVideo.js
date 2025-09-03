import React from "react";
function SingleVideo(props) {
  const handleVideoClick = (event) => {
    event.preventDefault();
  };
  return (
    <div
      className="singleVideo"
      onClick={() => props.onIndex(0)}
      style={{
        maxHeight: "500px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        width="320"
        height="240"
        style={{
          objectFit: "contain",
          position: "relative",
          maxHeight: "500px",
          zIndex: 2,
        }}
        controls
        onClick={handleVideoClick}
      >
        <source src={props.src} type="video/mp4" />
        <source src={props.src} type="video/ogg" />
      </video>
      <img
        src={props.thumbnailUrl}
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

export default React.memo(SingleVideo);
