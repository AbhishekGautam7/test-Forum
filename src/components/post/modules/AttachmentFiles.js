import React from "react";
function AttachmentFiles(props) {
  const { files } = props;
  const linkFile = (myurl)=>{
    window.location.assign(myurl);
  }
  return (
    <div className="fileList">
      {files &&
        files.length > 0 &&
        files.map((item, index) => {
          return (
            <div className="item" key={item.key + new Date().getMilliseconds()}>
              <div className="icon">
                <button
                  onClick={()=>linkFile(item.fileUrl)}
                  alt={item.fileName}
                  download
                  rel="noreferrer"
                >
                  <img
                    src={process.env.REACT_APP_SITE_URL + "document.svg"}
                    alt="Download Document"
                  />
                </button>
              </div>
              <div className="desc">
                <button
                  alt={item.fileName}
                  download
                  rel="noreferrer"
                  onClick={()=>linkFile(item.fileUrl)}
                >
                  {item.fileName}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default React.memo(AttachmentFiles);
