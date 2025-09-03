import React from "react";
function FilePanel(props) {
  return (
    <section className="gif-content-holder">
      {props.attachments.map((item) => {
        return (
          <div className="gif-content" key={item.key}>
           
            {item.fileType === "image" ? (
              <img
                src={item.fileUrl}
                alt="image"
                title={item.fileName}
                loading="lazy"
              />
            ) : item.fileType === "video" ? (
              <video width="120" height="90" controls>
                <source src={item.fileUrl} type="video/mp4" />
                <source src={item.fileUrl} type="video/ogg" />
              </video>
            ) : (
              <div className="documentFiles">
                <img src={process.env.REACT_APP_SITE_URL + "document.svg"} />
                <span>{item.fileName}</span>
              </div>
            )}
             <div className="closeDiv"><button className="btn-close" onClick={()=>props.onRemoveFile(item.key)}></button></div>
          </div>
        );
      })}
    </section>
  );
}

export default React.memo(FilePanel);
