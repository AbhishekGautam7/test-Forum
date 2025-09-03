import React, { useState, useEffect } from "react";
function MultiImage(props) {
  const { data } = props;
  const [size, setSize] = useState("");
  const setDimensional = (e) => {
    try {
      let size =
        e.target.naturalWidth > e.target.naturalHeight
          ? "tile"
          : e.target.naturalWidth < e.target.naturalHeight
          ? "vtile"
          : e.target.naturalWidth === e.target.naturalHeight
          ? "squre"
          : "other";

      setSize(() => size);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoClick = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (data[0].fileType === "video") {
      setSize(() => "vtile");
    }
  }, []);
  const showError = (e) => {
    e.target.style.display = "none";
  };
  return (
    <>
      <div className={`gallery ${size}`}>
        {data && data.length > 0 && data[0].fileType === "image" && (
          <div
            className="firstTile"
            onClick={() => props.onIndex(0)}
            style={{
              maxHeight: "500px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={data[0].fileUrl}
              title={data[0].fileName}
              alt={data[0].fileName}
              data-type={data[0].fileType}
              onLoad={(e) => setDimensional(e)}
              onError={(e) => showError(e)}
              className="pic"
              name={data[0].fileName}
              style={{
                objectFit: "contain",
                maxHeight: "500px",
                zIndex: 2,
              }}
            />
            <img
              className="backImg"
              src={data[0].fileUrl}
              title={data[0].fileName}
              style={{
                maxHeight: "500px",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                webkitFilter: "blur(10px)",
                filter: "blur(10px)",
                zIndex: 1,
              }}
            />
          </div>
        )}
        {data && data.length > 0 && data[0].fileType === "video" && (
          <div
            className="firstTile"
            onClick={() => props.onIndex(0)}
            style={{
              maxHeight: "500px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <video
              width="320"
              data-type={data[0].fileType}
              height="240"
              controls
              className="pic"
              onError={(e) => showError(e)}
              onClick={handleVideoClick}
              style={{
                objectFit: "contain",
                maxHeight: "500px",
                zIndex: 2,
              }}
            >
              <source src={data[0].fileUrl} type="video/mp4" />
              <source src={data[0].fileUrl} type="video/ogg" />
            </video>
            <img
              src={data[0].thumbnailUrl}
              style={{
                position: "absolute",
                objectFit: "cover",
                top: 0,
                left: 0,
                zIndex: 1,
                filter: "blur(10px)",
                WebkitFilter: "blur(10px)",
              }}
            />
          </div>
        )}
        {/*
        <div className="firstTile">
              <video
                width="320"
                data-type={data[0].fileType}
                height="240"
                controls
                onLoad={(e) => setDimensional(e)}
                className="pic"
              >
                <source src={data[0].fileUrl} type="video/mp4" />
                <source src={data[0].fileUrl} type="video/ogg" />
              </video>
            </div>
        */}
        <div className="tileRow" style={{ maxHeight: "300px" }}>
          {data &&
            data.length > 0 &&
            data.map((item, index) => {
              return (
                index > 0 &&
                index < 3 && (
                  <div
                    onClick={() => props.onIndex(index)}
                    key={index}
                    className={
                      index == 1 ? "secondTile" : index === 2 ? "thirdTile" : ""
                    }
                  >
                    {index == 2 && data.length > 3 && (
                      <div className="mask" style={{ zIndex: 234 }}>
                        +{data.length - 3}
                      </div>
                    )}
                    {item.fileType === "image" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          width: "100%",
                          maxHeight: "300px",
                          overflow: "hidden",
                          gap: "5px",
                        }}
                      >
                        <img
                          className="backImg"
                          src={item.fileUrl}
                          title={item.fileName}
                          alt={item.fileName}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "blur(10px)",
                            webkitFilter: "blur(10px)",
                            zIndex: 1,
                          }}
                        />

                        <img
                          src={item.fileUrl}
                          title={item.fileName}
                          alt={item.fileName}
                          className="pic"
                          onError={(e) => showError(e)}
                          style={{
                            objectFit: "contain",
                            maxHeight: "100%",
                            maxWidth: "100%",
                            zIndex: 2,
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          width: "100%",
                          maxHeight: "300px",
                          overflow: "hidden",
                          gap: "5px",
                        }}
                      >
                        <img
                          src={item.thumbnailUrl}
                          title={item.fileName}
                          alt={item.fileName}
                          className="pic"
                          onError={(e) => showError(e)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: "blur(10px)",
                            webkitFilter: "blur(10px)",
                            zIndex: 1,
                          }}
                        />
                        <video
                          width="320"
                          height="240"
                          controls
                          onError={(e) => showError(e)}
                          onClick={handleVideoClick}
                          style={{
                            objectFit: "contain",
                            maxHeight: "100%",
                            maxWidth: "100%",
                            zIndex: 2,
                          }}
                        >
                          <source src={item.fileUrl} type="video/mp4" />
                          <source src={item.fileUrl} type="video/ogg" />
                        </video>
                      </div>
                    )}
                  </div>
                )
              );
            })}
        </div>
      </div>
    </>
  );
}

export default React.memo(MultiImage);
