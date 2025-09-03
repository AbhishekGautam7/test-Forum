import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getCommunityFeedByKeyword,
	advanceSearchConversations,
} from "../../api/community";
import {
	setFeeds,
	setMessageBox,
	setMessageTxt,
	setMessageBoxCloseBtn,
	setLoading,
	setTag,
	setFeedIdList,
	hasMoreFeed,
	setFeedsName,
	setTotalFeed,
	setSearchBoxStatus,
} from "../../redux";
import NextFeeds from "../modules/NextFeeds";
import Post from "../post/Post";

function Conversations() {
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const keyword = useSelector((state) => state.search.keyword);
	const feeds = useSelector((state) => state.feeds);
	const searchResult = useSelector((state) => state.search.searchResult);
	const tab = useSelector((state) => state.search.tab);
	const searchType = useSelector((state) => state.search.type);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const dispatch = useDispatch();
	const userRole = useSelector((state) => state.myProfile.data.role);
	const myCommunity = useSelector((state) => state.myCommunity.data);

	useEffect(() => {
		try {
			console.log(tab, searchResult, keyword, searchType, userRole);
			// conversations true test private
			let abortController = new AbortController();

			dispatch(setSearchBoxStatus(false));
			// Only condition meet if user do search from quick searchbox
			if (
				keyword.length > 0 &&
				searchResult === true &&
				searchType === "private"
			) {
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading Conversations ... "));
				dispatch(setMessageBoxCloseBtn(false));
				setLoading("Loading...");
				dispatch(setFeeds([]));
				dispatch(setTotalFeed(0));
				dispatch(setTag(""));

				userRole === "user" &&
					getCommunityFeedByKeyword({
						keyword,
						count,
						token,
						appId,
						status: userRole === "admin" ? "all" : "live",
					}).then((response) => {
						setLoading(false);
						dispatch(setFeeds(response.list));
						dispatch(setFeedIdList(response.list.map((item) => item._id)));
						dispatch(hasMoreFeed(response.metadata.hasMore));
						dispatch(setMessageBox(false));
						dispatch(setFeedsName("privateKeywordSearchConversation"));
						dispatch(setTotalFeed(response.metadata.totalCount));
					});

				userRole === "admin" &&
					advanceSearchConversations({
						keyword: keyword,
						count: count,
						status: "all",
						token,
						appId,
					}).then((res) => {
						dispatch(setFeeds(res.list));
						dispatch(setFeedIdList(res.list.map((item) => item._id)));
						dispatch(hasMoreFeed(res.metadata.hasMore));
						dispatch(setFeedsName("publicKeywordAdvanceSearchConversation"));
						dispatch(setTotalFeed(res.metadata.totalCount));
						dispatch(setMessageBox(false));
					});
			}
			return () => {
				abortController.abort();
			};
		} catch (error) {
			console.error(error);
		}
	}, [searchResult, keyword, searchType]);
	return (
		<div>
			{feeds && feeds.data && feeds.data.length === 0 && (
				<div>No Conversations Feed Found </div>
			)}
			{feeds &&
				feeds.data &&
				feeds.data.length > 0 &&
				feeds.data.map((item) => (
					<Post feedId={item._id} data={item} key={item._id} />
				))}

			<NextFeeds name="searchConversation" />
		</div>
	);
}

export default Conversations;
