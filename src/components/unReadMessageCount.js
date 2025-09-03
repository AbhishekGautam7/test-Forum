import React from "react";

const UnReadMessageCount = ({ count }) => {
	return (
		<span
			className="position-absolute"
			style={{
				left: "calc(50% + 7px)",
				top: "-1px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: "0.6rem",
			}}
		>
			{count}
		</span>
	);
};

export default UnReadMessageCount;
