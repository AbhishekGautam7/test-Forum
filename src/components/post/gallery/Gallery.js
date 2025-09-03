import React, { useEffect, useState } from "react";
import SingleVideo from "./SingleVideo";
import SingleImage from "./SingleImage";
import MultiImages from "./MultiImages";

function Gallery(props) {
  const [gallery, setGallery] = useState([]);
  useEffect(() => {
    setGallery(() => [...props.attachments]);
  }, []);

  return (
    <>
      {gallery && gallery.length === 1 && gallery[0].fileType === "video" && (
        <SingleVideo
          src={gallery[0].fileUrl}
          thumbnailUrl={gallery[0].thumbnailUrl}
          onIndex={(index) => props.onIndex(index)}
        />
      )}
      {gallery && gallery.length === 1 && gallery[0].fileType === "image" && (
        <SingleImage
          src={gallery[0].fileUrl}
          onIndex={(index) => props.onIndex(index)}
          name={gallery[0].fileName}
        />
      )}

      {gallery &&
        gallery.length > 1 &&
        (gallery[0].fileType === "image" ||
          gallery[0].fileType === "video") && (
          <MultiImages
            key={gallery[0].name}
            onIndex={(index) => props.onIndex(index)}
            data={gallery}
          />
        )}
    </>
  );
}
export default React.memo(Gallery);
