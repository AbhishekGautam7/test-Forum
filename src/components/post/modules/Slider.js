import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TopLeftIcon,
  TopRightIcon,
} from "../../icons/index";

function Slider(props) {
  const { index, gallery } = props;
  const [size, setSize] = useState("");
  const [currentIndex, setCurrentIndex] = useState(index || 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (index !== undefined) {
      setCurrentIndex(index);
      setSize("");
    }
  }, [index]);

  const changeSlide = (newIndex) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 200);
  };

  const showNext = () => {
    if (currentIndex < gallery.length - 1) {
      changeSlide(currentIndex + 1);
    }
  };

  const showPrevious = () => {
    if (currentIndex > 0) {
      changeSlide(currentIndex - 1);
    }
  };

  const loadImg = (e) => {
    if (e.target.naturalWidth > e.target.naturalHeight) {
      setSize("landscape");
    } else if (e.target.naturalWidth < e.target.naturalHeight) {
      setSize("portrait");
    } else {
      setSize("square");
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    window.location.href = gallery[currentIndex].fileUrl;
  };

  return (
    <div className="slider">
      <div className={`sliderInner ${isTransitioning ? "fade" : ""}`}>
        <button title="Back" className="backBtn" onClick={() => props.onBack()}>
          <TopLeftIcon />
        </button>
        <button
          title="Download"
          className="downloadBtn"
          onClick={handleDownload}
        >
          <TopRightIcon />
        </button>
        {gallery && gallery.length > 0 && currentIndex > 0 && (
          <button className="prevBtn" onClick={showPrevious}>
            <ArrowLeftIcon />
          </button>
        )}
        {gallery && gallery.length > 0 && currentIndex < gallery.length - 1 && (
          <button className="nextBtn" onClick={showNext}>
            <ArrowRightIcon />
          </button>
        )}
        {gallery[currentIndex].fileType === "image" ? (
          <div className="img">
            {(size === "portrait" || size === "square") && (
              <img
                className="backimg size"
                src={gallery[currentIndex].fileUrl}
                alt="Image"
                key={currentIndex}
                style={{ maxHeight: "500px" }}
              />
            )}
            <img
              src={gallery[currentIndex].fileUrl}
              alt="Image"
              onLoad={loadImg}
              className={
                size === "portrait" || size === "square" ? "port" : "land"
              }
              key={`img-${currentIndex}`}
              style={{ maxHeight: "500px" }}
            />
          </div>
        ) : (
          <div
            style={{
              maxHeight: "500px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={gallery[currentIndex].thumbnailUrl}
              title={gallery[currentIndex].fileName}
              alt={gallery[currentIndex].fileName}
              className="pic"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                objectFit: "cover",
                filter: "blur(10px)",
                WebkitFilter: "blur(10px)",
              }}
            />
            <video
              key={`video-${currentIndex}`}
              style={{
                position: "relative",
                objectFit: "contain",
                maxHeight: "500px",
                zIndex: 2,
              }}
              controls
              autoPlay
            >
              <source src={gallery[currentIndex].fileUrl} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Slider);
