/* eslint-disable */
import React, { useEffect, useState } from "react";
import { fetchOrgFeeds } from "../../api/orgAdmin";
import Post from ".././post/Post";
import { useDispatch, useSelector } from "react-redux";
import {
	setFeeds,
	setLoading,
	setFeedsName,
	setFeedIdList,
	hasMoreFeed,
} from "../../redux";

import NextFeeds from "../modules/NextFeeds";
function AdminPostList({ myCommunity }) {
	const dispatch = useDispatch();
	const userRole = useSelector((state) => state.myProfile.data.role);
	const feeds = useSelector((state) => state.feeds.data);
	const communityId = useSelector((state) => state.info.communityId);
	const [loadingFeed, setLoadingFeed] = useState("");
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const apiLoading = useSelector((state) => state.info.isLoading);
	const page = useSelector((state) => state.info.page);
	const count = useSelector((state) => state.feeds.pagePerPage);
	//const myCommunity = useSelector((state) => state.myCommunity.data);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);

	useEffect(() => {
		let payload = {
			token,
			appId,
			count,
		};
		if (communityId !== null) {
			payload.communityId = communityId;
		}
		payload.page = 1;

		if (loadingFeed.length === 0) {
			setLoadingFeed("Loading all feeds ..");
			dispatch(setLoading("Loading all feeds .."));
			fetchOrgFeeds(payload)
				.then((res) => {
					// console.log("Res from admin post list api", res);

					if (res.list) {
						setLoadingFeed("");
						dispatch(setFeeds(res.list));

						dispatch(setFeedIdList(res.list.map((item) => item._id)));
						dispatch(setLoading(false));
						dispatch(hasMoreFeed(res.metadata.hasMore));
						dispatch(setFeedsName("live"));
					}
				})
				.catch((error) => {
					console.error(error);
					dispatch(setLoading(false));
				});
		}
	}, []);

	// console.log(feeds);
	const showMessage = () => {
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
				feeds.length > 0 &&
				feeds.map((item) => (
					<Post
						feedId={item._id}
						data={item}
						myCommunity={myCommunity}
						key={item._id}
					/>
				))}

			{feeds &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "scheduled" &&
				showMessage()}
			{feeds &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "past" &&
				showMessage()}
			{feeds &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "conversations" &&
				showMessage()}
			{feeds &&
				feeds.length === 0 &&
				!apiLoading &&
				communityHeaderTab === "deleted" &&
				showMessage()}

			{(page === "eachcommunity" ||
				page === "tagsearch" ||
				page === "home") && <NextFeeds myCommunity={myCommunity} />}
		</>
	);
}

export default React.memo(AdminPostList);
