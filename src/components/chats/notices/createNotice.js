import { uploadFile } from "../../../api/upload";
import { useEffect, useRef, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "reactstrap";
import SunEditor from "suneditor-react";
// import { TextEditor } from "kigan-react-simple-text-editor";

import TextEditor from "./textEditor";

const CreateNotice = ({
  setIsCreateNoticeFormOpen,
  message,
  setMessage,
  sendMessage,
}) => {
  // const [startDate, setStartDate] = useState(new Date("2014/02/08"));
  // const [endDate, setEndDate] = useState(new Date("2014/02/10"));
  // const [description, setDescription] = useState();

  const editor = useRef();

  const [isTyping, setIsTyping] = useState(false);

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  }, [isTyping]);

  const onImageUploadBefore = (files, _info, uploadHandler) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("client", "BT101");
    formData.append("bucket", "video-communication");

    uploadFile(formData).then((res) => {
      const payload = {
        result: [
          {
            url: res.data[0].file.Location,
            name: files[0]?.name,
            size: files[0]?.size,
          },
        ],
      };
      uploadHandler(payload);
    });

    // return undefined;
  };

  return (
    <div className="mt-3">
      <TextEditor setContent={setMessage} content={message} />

      {/* <SunEditor
        // setContents={message}
        getSunEditorInstance={getSunEditorInstance}
        defaultValue={message}
        showToolbar={true}
        onChange={(value) => {
          console.log("value", !!editor.current.getText()[0]);
          setIsTyping(true);

          setMessage(value);
        }}
        setDefaultStyle="min-height: calc(100vh - 380px)"
        placeholder="Write your notice"
        onImageUploadBefore={onImageUploadBefore}
        setOptions={{
          buttonList: [
            [
              "bold",
              "underline",
              "italic",
              "list",
              "align",
              "fontSize",
              // "link",
              // "image",
            ],
          ],
        }}
      /> */}

      {/* <div className="d-flex px-1 py-3 align-items-center justify-content-between">
				<div>
					<strong className="custom-black">Members can comment to all</strong>
					<p className="muted fs-7">
						Allow or restrict members to comment on this announcement.
					</p>
				</div>

				<Switch uncheckedIcon={false} checkedIcon={false} />
			</div>
			<div className="d-flex px-1 py-3  align-items-center justify-content-between">
				<div>
					<strong className="custom-black">
						Members can comment to admin only
					</strong>
					<p className="muted fs-7">
						Allow or restrict members to comment on this announcement.
					</p>
				</div>

				<Switch uncheckedIcon={false} checkedIcon={false} />
			</div>
			<div className="d-flex px-1 py-3  align-items-center justify-content-between">
				<div>
					<strong className="custom-black">Schedule this notice</strong>
					<p className="muted fs-7">
						Choose a date and time to send this announcement automatically.
					</p>
				</div>

				<Switch uncheckedIcon={false} checkedIcon={false} />
			</div> */}
      {/* <div className="d-flex align-items-center gap-3 p-2">
				<ReactDatePicker
					selected={startDate}
					onChange={(date) => setStartDate(date)}
					selectsStart
					startDate={startDate}
					endDate={endDate}
					customInput={<CustomInput />}
					isClearable={true}
					placeholderText="Publish date"
				/>
				<ReactDatePicker
					selected={endDate}
					onChange={(date) => setEndDate(date)}
					selectsEnd
					startDate={startDate}
					endDate={endDate}
					minDate={startDate}
					customInput={<CustomInput />}
					isClearable={true}
					placeholderText="End date"
				/>
			</div> */}
      <Button
        color="primary w-100 mt-1"
        onClick={() => {
          sendMessage();
          setIsCreateNoticeFormOpen(false);
        }}
        disabled={!message || isTyping}
        onKeyPress={(e) => {
          e.key === "Enter" && sendMessage();
        }}
      >
        <FaCirclePlus className="me-2" />
        <strong>Send new notice</strong>
      </Button>
      <Button
        outline
        color="primary w-100 mt-1"
        onClick={() => {
          setIsCreateNoticeFormOpen(false);
        }}
      >
        <IoIosArrowBack className="me-2" />
        <strong>Back</strong>
      </Button>
    </div>
  );
};

export default CreateNotice;
