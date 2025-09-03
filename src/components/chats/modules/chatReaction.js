import React from "react";

const ChatReaction = ({ message }) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: message?.isOwnMessage ? "flex-end" : "flex-start",
			}}
		>
			<div
				style={{
					background: "#e7e7e7",
					borderRadius: "8px",
					border: "1px solid #e7e7e7",
					width: "50px",
					height: "30px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<span>&#128077;</span>
				<span
					style={{
						fontSize: "0.7rem",
						marginLeft: "3px",
						fontWeight: "600",
					}}
				>
					{message?.totalReaction}
				</span>
			</div>
		</div>
	);
};

export default ChatReaction;
