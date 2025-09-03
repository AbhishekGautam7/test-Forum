import React from "react";
import { allowedDocTypes, allowedImageTypesInChat } from "../../../constants";
import { getFileExtension } from "../../../libary/extractExtensionFromUrl";
import { BsFiletypePdf } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { allowedAudioVideoFileTypes } from "../../../constants/constants";
import { FaRegFileAudio } from "react-icons/fa";
import { CiVideoOn } from "react-icons/ci";

const GroupMessageBlock = ({
	docPadding,
	url,
	height,
	width,
	iconSize,
	isMessage,
}) => {
	const extension = getFileExtension(url);

	let content;

	const contentStyles = {
		fontSize: "0.875rem",
		lineHeight: "1.225rem",
		letterSpacing: "0.00875rem",
		display: "flex",
		alignItems: "center",
		gap: "1px",
		height: height,
		padding: docPadding,
		boxShadow: "0 0 1px rgba(0,0,0,0.5)",
		background: "rgba(255,255,255,0.5)",
		borderRadius: "4px",
		justifyContent: "center",
	};

	if (allowedImageTypesInChat.includes(extension)) {
		content = (
			<img
				alt="parentMessage"
				style={{
					height,
					maxWidth: width,
					borderRadius: "6px",
				}}
				src={url}
			/>
		);
	} else if (allowedDocTypes.includes(extension)) {
		content = (
			<p style={contentStyles}>
				{extension === "pdf" ? (
					<>
						<BsFiletypePdf size={iconSize} />
					</>
				) : (
					<>
						<IoDocumentTextOutline size={iconSize} />{" "}
					</>
				)}
			</p>
		);
	} else if (allowedAudioVideoFileTypes.includes(extension)) {
		const subContent = () => {
			if (extension === "mp4") {
				if (!isMessage) {
					return (
						<span style={contentStyles}>
							<CiVideoOn size={30} />
						</span>
					);
				} else {
					return (
						<video height="100%" width="100%" controls>
							<source src={url} type="video/mp4" />
						</video>
					);
				}
			} else if (extension === "mp3") {
				if (!isMessage) {
					return (
						<span style={contentStyles}>
							<FaRegFileAudio size={30} />
						</span>
					);
				} else {
					return (
						<audio controls>
							<source src={url} type="audio/mp3" />
						</audio>
					);
				}
			}
		};
		content = (
			<p
				style={{
					height: extension === "mp4" ? height : "auto",
				}}
			>
				{subContent()}
			</p>
		);
	} else {
		content = (
			<p
				style={{
					fontSize: "0.8rem",
					lineHeight: "1.225rem",
					letterSpacing: "0.00875rem",
					display: "flex",
					alignItems: "center",
					gap: "1px",
					wordBreak: "break-word",
				}}
			>
				{url}
			</p>
		);
	}
	return <>{content}</>;
};

export default GroupMessageBlock;
