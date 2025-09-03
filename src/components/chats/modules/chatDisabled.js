import React from "react";

import { TbMessageOff } from "react-icons/tb";

const ChatDisabled = () => {
	return (
		<div
			style={{
				height: "80vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				gap: "20px",
			}}
		>
			<TbMessageOff
				size={100}
				style={{
					strokeWidth: "1",
				}}
			/>
			<p
				style={{
					color: "#535253",
					fontSize: "0.9rem",
					wordBreak: "break-word",
					padding: "0 1rem",
					textAlign: "center",
				}}
			>
				Chat service is not enabled, contact your administrator
			</p>
		</div>
	);
};

export default ChatDisabled;
