import Avatar from "../../modules/Avatar";
import TimeAgo from "javascript-time-ago";

const CommentBox = ({ comment, communityUsers }) => {
	const timeAgo = new TimeAgo("en-US");

	return (
		<div
			key={comment._id}
			style={{
				border: "1px solid #ededed",
				padding: "0.75rem 1.5rem",
				display: "flex",
				flexDirection: "column",
				gap: "0.4rem",
			}}
		>
			<div className="d-flex align-items-center gap-2">
				<Avatar
					src={comment?.senderDetails?.profileUrl}
					size="20px"
					alt="profile"
					fullName={
						comment?.senderDetails?.firstName +
						" " +
						comment?.senderDetails?.lastName
					}
					initialsFontSize="10px"
				/>
				<strong
					className="custom-black text-capitalize"
					style={{
						fontSize: "0.8rem",
					}}
				>
					{comment?.senderDetails?.firstName +
						" " +
						comment?.senderDetails?.lastName}
				</strong>
				<small className="fs-7 text-muted">
					{timeAgo.format(new Date(comment.updatedAt))}
				</small>
			</div>
			<small>{comment.content && comment.content[0]}</small>
		</div>
	);
};

export default CommentBox;
