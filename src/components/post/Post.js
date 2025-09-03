import React, { useEffect, useState } from "react";
import DiscussionPost from "./discussion/DiscussionPost";
import PostAction from "./modules/PostAction";
import PostHeader from "./modules/PostHeader";
import PostReaction from "./modules/PostReaction";
import Comment from "./comments/Comment";
import QuestionPost from "./question/QuestionPost";
import { useSelector, useDispatch } from "react-redux";
import { setCommentCount } from "../../redux";

function Post(props) {
	const { feedId, myCommunity } = props;
	console.log("Got Post ........................", props);
	const [likeCount, setLikeCount] = useState(0);
	//const myCommunity = useSelector((state) => state.myCommunity.data);
	const feed = useSelector((state) =>
		state.feeds.data.find((item) => item._id === feedId)
	);
	const dispatch = useDispatch();
	useEffect(() => {
		let abortController = new AbortController();
		setLikeCount(feed.likesCount);
		return () => {
			abortController.abort();
		};
	}, [myCommunity, feed]);

	const deleteComment = (id) => {
		console.log("Post Deleted comment", id);
		dispatch(
			setCommentCount({
				feedId: feedId,
				commentCount: feed.commentCount - 1,
			})
		);
	};

	const setCommentCounter = (obj) => {
		dispatch(
			setCommentCount({
				feedId: obj.feedId,
				commentCount: obj.commentCount,
			})
		);
	};
	return (
		feed &&
		feed._id && (
			<div className="common-box">
				<div className="posting-section-body">
					<PostHeader data={feed} feedId={feed._id} />

					{feed && feed.type === "Discussion" ? (
						<DiscussionPost data={feed} feedId={feed._id} />
					) : feed && feed.type === "Question" ? (
						<QuestionPost data={feed} feedId={feed._id} />
					) : (
						""
					)}

					{((feed.hasOwnProperty("mode") === true && feed.mode === "") ||
						feed.hasOwnProperty("mode") === false) && (
						<>
							<PostReaction likeCount={likeCount} />
							<PostAction
								feedId={feed._id}
								setLikeCount={setLikeCount}
								myCommunity={myCommunity}
								// commentCount={commentCount}
							/>
							{feed.commentStatus && feed.commentStatus === true && (
								<Comment
									feedId={feed._id}
									onSetCommentCount={(obj) => setCommentCounter(obj)}
									onDeleteComment={(id) => deleteComment(id)}
								/>
							)}
						</>
					)}
				</div>
			</div>
		)
	);
}
export default Post;
