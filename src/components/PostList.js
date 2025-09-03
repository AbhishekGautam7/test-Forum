/* eslint-disable */
import React, { useEffect, useState } from "react";
import { getAllFeed } from "../api/community";
import Post from "./post/Post";
import { useDispatch, useSelector } from "react-redux";
import NextFeeds from "./modules/NextFeeds";

import {
	setFeeds,
	setLoading,
	setMessageBox,
	setMessageTxt,
	setMessageBoxCloseBtn,
	setFeedsName,
	hasMoreFeed,
	setFeedIdList,
	setTotalFeed,
} from "../redux";

function PostList({ myCommunity }) {
	const dispatch = useDispatch();

	const feeds = useSelector((state) => state.feeds.data);
	const communityId = useSelector((state) => state.info.communityId);
	const [loadingFeed, setLoadingFeed] = useState("");
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const apiLoading = useSelector((state) => state.info.isLoading);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);
	const role = useSelector((state) => state.myProfile.data.role);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const tag = useSelector((state) => state.info.tag);

	useEffect(() => {
		try {
			let abortController = new AbortController();
			let payload = {
				appId,
				token,
				count,
			};
			if (communityId !== null) {
				payload.communityId = communityId;
			}

			if (loadingFeed.length === 0 && tag.length === 0) {
				setLoadingFeed("Loading feeds ..");
				dispatch(setLoading("Loading feeds ..."));
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading feeds ..."));
				dispatch(setMessageBoxCloseBtn(false));
				getAllFeed(payload)
					.then((res) => {
						setLoadingFeed("");

						dispatch(setLoading(false));
						dispatch(setMessageBox(false));
						dispatch(setFeedsName("live"));
						if (res && res.list) {
							dispatch(setFeeds(res.list));
							dispatch(setFeedIdList(res.list.map((item) => item._id)));
						}

						dispatch(hasMoreFeed(res.metadata.hasMore));
						dispatch(setTotalFeed(res.metadata.total));
						payload.feedListName = "live";
					})
					.catch((error) => {
						console.error(error.response);
						dispatch(setLoading(false));
						dispatch(setMessageBox(false));
					});
			}
			return () => {
				abortController.abort();
			};
		} catch (error) {
			console.error(error);
		}
	}, []);

	//only commit
	// Scroll To Top while chaning community
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [communityId]);
	const showStartMessage = () => {
		return (
			<div className="community-getting-started">
				{/* <div className="img-wrap">
					<img
						src={process.env.REACT_APP_SITE_URL + "get-started.png"}
						alt="image"
						loading="lazy"
					/>
				</div>
				<h4>Get Started</h4>
				<p>what do you waiting for? Start the conversation now</p> */}
			</div>
		);
	};

	return (
		<>
			{feeds &&
				Array.isArray(feeds) &&
				feeds.length > 0 &&
				feeds.map((item) => (
					<Post myCommunity={myCommunity} feedId={item._id} key={item._id} />
				))}
			{feeds &&
				Array.isArray(feeds) &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "scheduled" &&
				showStartMessage()}
			{feeds &&
				Array.isArray(feeds) &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "past" &&
				showStartMessage()}
			{feeds &&
				Array.isArray(feeds) &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "deleted" &&
				showStartMessage()}
			{role === "user" && <NextFeeds myCommunity={myCommunity} name="live" />}
			{feeds &&
				Array.isArray(feeds) &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "conversations" &&
				showStartMessage()}{" "}
		</>
	);
}

export default React.memo(PostList);
