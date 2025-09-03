import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { uploadFile } from "../../../api/upload";

import { allowedFileTypesInChat } from "../../../constants";
import { setMessageBox, setMessageTxt } from "../../../redux";

const useFileUpload = () => {
	const fileInputRef = useRef(null);

	const [files, setFiles] = useState([]);

	const [error, setError] = useState(null);

	const [isUploading, setIsUploading] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		const currentRef = fileInputRef.current;
		const handleImageUpload = (e) => {
			const file = e.target.files[0];

			if (error) {
				setError(null);
			}

			// Validate file size
			const maxSize = 20 * 1024 * 1024; // 20MB
			if (file.size > maxSize) {
				setError("File size exceeds 20MB limit");
				return;
			}

			const fileType = file.name.split(".").pop().toLowerCase();

			if (!allowedFileTypesInChat.includes(fileType)) {
				setError(
					"Invalid file type. Allowed types are: text, jpg, jpeg, png, mp3, mp4, pdf, doc, docx"
				);
				return;
			}

			// Check the number of uploaded files
			if (files.length >= 5) {
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("You can only upload a maximum of 5 files"));
				setTimeout(() => {
					dispatch(setMessageBox(false));
				}, 2000);
				return;
			}

			const formData = new FormData();
			formData.append("file", file);
			formData.append("client", "BT101");
			formData.append("bucket", "video-communication");

			setIsUploading(true);

			uploadFile(formData)
				.then((res) => {
					setFiles((prevState) => [...prevState, res.data[0].file.Location]);
				})
				.finally(() => setIsUploading(false));
		};

		if (currentRef) {
			currentRef.addEventListener("change", handleImageUpload);
			currentRef.addEventListener("click", () => {
				currentRef.value = null;
			});
		}

		return () => {
			if (currentRef) {
				currentRef.removeEventListener("change", handleImageUpload);
				currentRef.removeEventListener("click", () => {
					currentRef.value = null;
				});
			}
		};
	}, [dispatch, error, files.length]);
	return {
		fileInputRef,
		error,
		isUploading,
		files,
		setFiles,
	};
};

export { useFileUpload };
