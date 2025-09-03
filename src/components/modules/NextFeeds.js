import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setMessageBox,
	setMessageTxt,
	setFeeds,
	setMessageBoxCloseBtn,
	setLoading,
	setPost,
	setFeedsName,
	setFeedIdList,
	hasMoreFeed,
	setTag,
	setTotalFeed,
} from "../../redux";
import {
	getAllFeed,
	getFeedByTag,
	getCommunityFeedByKeyword,
	advanceSearchConversations,
} from "../../api/community";
import { getAllScheduedPosts, getPastFeeds } from "../../api/schedule";
import { fetchOrgFeeds, fetchDeletedFeeds } from "../../api/orgAdmin";
import { getStatus } from "../../libary/global";

function NextFeeds(props) {
	const { name } = props;
	const feeds = useSelector((state) => state.feeds.data);
	const dispatch = useDispatch();
	const communityId = useSelector((state) => state.info.communityId);
	const perPageFeed = useSelector((state) => state.feeds.perPageFeed);
	const info = useSelector((state) => state.info);
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);

	const feedListName = useSelector((state) => state.feeds.name);
	const userRole = useSelector((state) => state.myProfile.data.role);
	const hasFeed = useSelector((state) => state.feeds.hasMoreFeed);
	const feedIdList = useSelector((state) => state.feeds.feedIdList);
	const tag = useSelector((state) => state.info.tag);
	const page = useSelector((state) => state.info.page);
	const feed = useSelector((state) =>
		state.feeds.data.find((item) => item._id === info.currentFeedId)
	);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const keyword = useSelector((state) => state.search.keyword);
	const search = useSelector((state) => state.search);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);

	const tagSearchFeeds = () => {
		try {
			dispatch(setMessageBox(true));
			dispatch(setMessageBoxCloseBtn(false));
			dispatch(setMessageTxt("Searching feeds with tag of #" + tag));
			dispatch(setFeedsName("tagsearch"));
			dispatch(setTag(tag));

			let payload = {
				keyword: tag,
				last: feedIdList[feedIdList.length - 1],
				count: perPageFeed,
				appId: appId,
				token: token,
			};
			if (userRole === "admin" && (page === "home" || page === "search")) {
				payload.status = "all";
			} else {
				payload.status = getStatus({
					userRole,
					page,
					feed,
					communityHeaderTab,
				});
			}
			if (communityId) {
				payload.communityId = communityId;
			}

			getFeedByTag(payload).then((res) => {
				try {
					if (res.length === 0) {
						dispatch(setMessageBox(true));
						dispatch(setMessageBoxCloseBtn(true));
						dispatch(setMessageTxt("No Data Found"));
					} else {
						dispatch(setFeeds([...feeds, ...res.list]));
						dispatch(setMessageBox(false));
						dispatch(setMessageBoxCloseBtn(true));
						dispatch(setMessageTxt(""));
						dispatch(setFeedIdList(res.list.map((item) => item._id)));
						dispatch(hasMoreFeed(res.metadata.hasMore));
					}
				} catch (error) {
					console.error(error);
				}
			});
		} catch (error) {
			console.error(error);
		}
	};
	const homeNextFeeds = (payload) => {
		try {
			dispatch(hasMoreFeed(false));
			return getAllFeed(payload)
				.then((res) => {
					dispatch(setFeeds([...feeds, ...res.list]));
					dispatch(setMessageBox(false));
					dispatch(setFeedIdList(res.list.map((item) => item._id)));
					dispatch(hasMoreFeed(res.metadata.hasMore));
				})
				.catch((error) => {
					console.error(error.response);
					dispatch(setLoading(false));

					dispatch(setMessageBox(false));
				});
		} catch (error) {
			console.error(error);
		}
	};

	const privateKeywordSearchConversation = (payload) => {
		try {
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading Conversation feeds ..."));
			dispatch(setMessageBoxCloseBtn(false));

			getCommunityFeedByKeyword({
				keyword,
				count,
				last: feedIdList[feedIdList.length - 1],
				appId: appId,
				token: token,
			}).then((response) => {
				setLoading(false);
				dispatch(setFeeds([...feeds, ...response.list]));
				dispatch(setFeedIdList(response.list.map((item) => item._id)));
				dispatch(hasMoreFeed(response.metadata.hasMore));
				dispatch(setMessageBox(false));
				dispatch(setFeedsName("privateKeywordSearchConversation"));
				dispatch(setTotalFeed(response.metadata.totalCount));
			});
		} catch (error) {
			console.error(error);
		}
	};
	const fetchAdminConversationFeeds = (payload) => {
		try {
			fetchOrgFeeds(payload)
				.then((res) => {
					dispatch(setFeeds([...feeds, ...res.list]));
					dispatch(setFeedIdList(res.list.map((item) => item._id)));
					dispatch(setMessageBox(false));
					dispatch(hasMoreFeed(res.metadata.hasMore));
				})
				.catch((error) => {
					console.error(error.response);
					dispatch(setLoading(false));
				});
		} catch (error) {
			console.error(error);
		}
	};
	const fetchPastFeeds = () => {
		try {
			dispatch(setPost(""));
			dispatch(hasMoreFeed(false));
			let payload = {
				communityId,
				appId,
				token,
			};

			payload.last = feedIdList[feedIdList.length - 1];

			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading Ended Posts ..."));
			dispatch(setMessageBoxCloseBtn(false));
			getPastFeeds(payload)
				.then((res) => {
					dispatch(setLoading(false));
					dispatch(setMessageBox(false));
					dispatch(setMessageBox(false));
					dispatch(setFeeds([...feeds, ...res.list]));
					dispatch(setMessageBoxCloseBtn(true));
					dispatch(setFeedsName("ended"));
					dispatch(hasMoreFeed(res.metadata.hasMore));
				})
				.catch((error) => {
					console.error(error);
					dispatch(
						setMessageTxt("Someting went wrong while fetching scheduled feeds.")
					);
					dispatch(setMessageBoxCloseBtn(true));
				});
		} catch (error) {
			console.error(error);
		}
	};
	const deletedFeeds = () => {
		dispatch(hasMoreFeed(false));
		dispatch(setPost(""));
		let payload = {
			communityId,
			token,
			appId,
		};

		payload.last = feedIdList[feedIdList.length - 1];

		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Loading Deleted Posts ..."));
		dispatch(setMessageBoxCloseBtn(false));
		fetchDeletedFeeds(payload)
			.then((res) => {
				dispatch(setLoading(false));
				dispatch(setMessageBox(false));
				dispatch(setMessageBox(false));
				dispatch(setFeeds([...feeds, ...res.list]));
				dispatch(setMessageBoxCloseBtn(true));
				dispatch(setFeedsName("deleted"));
				dispatch(hasMoreFeed(res.metadata.hasMore));
			})
			.catch((error) => {
				console.error(error);
				dispatch(
					setMessageTxt("Someting went wrong while fetching deleted feeds.")
				);
				dispatch(setMessageBoxCloseBtn(true));
			});
	};
	const fetchAllSchedulePosts = () => {
		try {
			dispatch(hasMoreFeed(false));
			dispatch(setPost(""));
			let payload = {
				token,
				appId,
				communityId,
			};

			payload.last = feedIdList[feedIdList.length - 1];

			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading Schedule Posts ..."));
			dispatch(setMessageBoxCloseBtn(false));

			getAllScheduedPosts(payload)
				.then((res) => {
					dispatch(setLoading(false));
					dispatch(setMessageBox(false));
					dispatch(setMessageBox(false));
					dispatch(setFeeds([...feeds, ...res.list]));
					dispatch(setMessageBoxCloseBtn(true));
					dispatch(setFeedsName("scheduled"));
					payload.feedListName = "scheduled";
					dispatch(hasMoreFeed(res.metadata.hasMore));
				})
				.catch((error) => {
					console.error(error);
					dispatch(
						setMessageTxt("Someting went wrong while fetching scheduled feeds.")
					);
					dispatch(setMessageBoxCloseBtn(true));
				});
		} catch (error) {
			console.error(error);
		}
	};
	const publicKeywordAdvanceSearchConversation = () => {
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Loading Conversation feeds ..."));
		dispatch(setMessageBoxCloseBtn(false));
		advanceSearchConversations({
			communityId: search.communityId,
			keyword: keyword,
			from: search.from,
			to: search.to,
			count: count,
			last: feedIdList[feedIdList.length - 1],
			appId: appId,
			token: token,
		}).then((response) => {
			dispatch(setFeeds([...feeds, ...response.list]));
			dispatch(setFeedIdList(response.list.map((item) => item._id)));
			dispatch(hasMoreFeed(response.metadata.hasMore));
			dispatch(setFeedsName("publicKeywordAdvanceSearchConversation"));
			dispatch(setTotalFeed(response.metadata.totalCount));
			dispatch(setMessageBox(false));
		});
	};
	const showNextFeeds = () => {
		let payload = {};
		if (communityId !== null) {
			payload.communityId = communityId;
		}
		payload.last = feedIdList[feedIdList.length - 1];
		payload.count = perPageFeed;
		payload.token = token;
		payload.appId = appId;

		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Loading next feeds ..."));
		dispatch(setMessageBoxCloseBtn(false));

		switch (feedListName) {
			case "live":
				userRole === "user"
					? homeNextFeeds(payload)
					: fetchAdminConversationFeeds(payload);
				break;
			case "scheduled":
				fetchAllSchedulePosts(payload);
				break;
			case "past":
				fetchPastFeeds(payload);
				break;
			case "deleted":
				deletedFeeds(payload);
				break;
			case "tagsearch":
				tagSearchFeeds();
				break;
			case "privateKeywordSearchConversation":
				privateKeywordSearchConversation();
				break;
			case "publicKeywordAdvanceSearchConversation":
				publicKeywordAdvanceSearchConversation();
				break;
			default:
				homeNextFeeds(payload);
		}
	};

	return (
		<div>
			{hasFeed && (
				<div className="nextFeedBlock">
					<button className="common-btn" onClick={() => showNextFeeds()}>
						Load More Feeds{" "}
					</button>
				</div>
			)}
		</div>
	);
}

export default NextFeeds;
