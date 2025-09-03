import React, { useEffect, useRef, useState } from "react";

import { Input } from "reactstrap";
import { IoIosArrowForward } from "react-icons/io";

import { RxCrossCircled } from "react-icons/rx";

import { ImAttachment } from "react-icons/im";

import GroupMessageBlock from "../groupChats/groupMessageBlock";
import useChatStore from "../../../stores/chatStore";

const ChatFooter = ({
  selectedMessageForReply,
  userMessage,
  sendMessage,
  writeMessage,
  setSelectedMessageForReply,
  error,
  fileInputRef,
  files,
  setFiles,
  overAllSetting,
  isUploading,
}) => {
  const { setHasClickedOnInputBox } = useChatStore((store) => store);
  return (
    <div>
      <div
        className="group-detail-footer flex-column position-relative"
        style={{
          display: overAllSetting?.canUserSendMessage ? "flex" : "none",
        }}
      >
        {selectedMessageForReply && (
          <div className="d-flex gap-2  justify-content-between message-reply">
            <div className="d-flex flex-column justify-content-center">
              <strong>
                {selectedMessageForReply?.senderDetails?.firstName +
                  " " +
                  selectedMessageForReply?.senderDetails?.lastName}
              </strong>

              <div className="d-flex flex-row gap-2">
                {selectedMessageForReply?.content
                  ?.slice(0, 2)
                  ?.map((url, index) => (
                    <GroupMessageBlock
                      iconSize={20}
                      url={url}
                      height="4rem"
                      width="5rem"
                      docPadding="2rem"
                      isMessage={false}
                    />
                  ))}
              </div>
            </div>
            <RxCrossCircled
              style={{
                cursor: "pointer",
              }}
              onClick={() => setSelectedMessageForReply(null)}
            />
          </div>
        )}
        {isUploading ? (
          <small
            style={{
              position: "absolute",
              top: "-4rem",
              left: 0,
              padding: "5px",
              background: "white",
              width: "100%",
              height: "4.3rem",
            }}
          >
            Uploading...
          </small>
        ) : (
          <>
            {files.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-4rem",
                  left: 0,
                  padding: "5px",
                  background: "white",
                }}
                className="d-flex  justify-content-between w-100"
              >
                <div className="d-flex gap-2">
                  {files?.length > 0 &&
                    files.map((file, index) => (
                      <div
                        className="uploaded-image position-relative"
                        key={index}
                      >
                        <GroupMessageBlock
                          height="4rem"
                          width="5rem"
                          iconSize={30}
                          url={file}
                          isMessage={false}
                          docPadding="2rem"
                        />
                        <div className="uploaded-image-overlay  ">
                          <RxCrossCircled
                            style={{
                              cursor: "pointer",
                              color: "#dc143c",
                              position: "absolute",
                              right: "-8px",
                              top: "-8px",
                            }}
                            onClick={() =>
                              setFiles((prevState) =>
                                prevState.filter((item, i) => i !== index)
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                </div>
                {files.length > 0 && (
                  <RxCrossCircled
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => setFiles([])}
                  />
                )}
              </div>
            )}
          </>
        )}

        <div className="d-flex w-100">
          <div className=" w-100 d-flex">
            <div>
              <label
                htmlFor="label"
                role="button"
                className="position-relative group-detail-footer-attachment-icon-wrapper"
              >
                <ImAttachment size={18} />

                <input
                  id="upload"
                  type="file"
                  ref={fileInputRef}
                  style={{
                    opacity: "0",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    cursor: "pointer",
                  }}
                  // multiple
                  // disabled={userMessage}
                  onChange={(e) => console.log("e", e.target.files[0])}
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
            </div>
            <Input
              value={userMessage}
              onChange={writeMessage}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
                setHasClickedOnInputBox(false);
              }}
              onBlur={() => {
                if (!userMessage) {
                  setHasClickedOnInputBox(false);
                }
              }}
              onClick={() => setHasClickedOnInputBox(true)}
              style={{
                height: "45px",
              }}
            />
          </div>
          <button
            className="group-detail-submit-button ms-2"
            onClick={() => {
              setHasClickedOnInputBox(false);
              sendMessage();
            }}
          >
            <IoIosArrowForward color="white" size={20} />
          </button>
        </div>
        {error && (
          <small
            style={{
              color: "red",
            }}
          >
            {error}
          </small>
        )}
      </div>
    </div>
  );
};

export default ChatFooter;
