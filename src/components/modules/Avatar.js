import { getFullNameInitials } from "../../libary/getFullNameInitials";

const Avatar = ({
	alt,
	size,
	src,
	initialsFontSize,
	borderRadius = "50%",
	showToolTip = false,
	fullName,
}) => {
	const initials = getFullNameInitials(fullName);
	return (
		<>
			{src ? (
				<div
					style={{
						height: size,
						width: size,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						borderRadius,
					}}
					className="avatar"
				>
					{showToolTip && <div className="avatar-tooltip">{fullName}</div>}
					<img
						alt={alt}
						src={src}
						style={{
							width: "100%",
							height: "100%",
							borderRadius,
							objectFit: "cover",
						}}
					/>
				</div>
			) : (
				<div
					style={{
						height: size,
						width: size,
						borderRadius,
						background: "#008080",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
					}}
					className="avatar"
				>
					{showToolTip && <div className="avatar-tooltip">{fullName}</div>}

					<span
						style={{
							fontSize: initialsFontSize,
							fontWeight: "700",
						}}
					>
						{initials}
					</span>
				</div>
			)}
		</>
	);
};

export default Avatar;
