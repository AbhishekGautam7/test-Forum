import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setCommunityId,
	setCurrentCommunity,
	setPage,
	setPost,
	setCommuinityHeaderTab,
	setFeeds,
	setLoading,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	hasMoreFeed,
	setFeedIdList,
	setMyCommunity,
} from "../redux";
import {
	getCommunityDetail,
	getAllFeed,
	getMyCommunityList,
	getUsersDetail,
} from "../api/community";
import { useCreateDefaultGroup } from "./chats/hooks";

function MyCommunities(props) {
	const title = props.title;
	const myData = useSelector((state) => state.myCommunity.data);
	const userId = useSelector((state) => state.info.userId);
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const userRole = useSelector((state) => state.myProfile.data.role);
	const [mycommmunityLoading, setMycommmunityLoading] = useState(null);
	const dispatch = useDispatch();
	const [isAll, setIsAll] = useState(true);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const [viewall, setViewAll] = useState(true);
	const [limitData, setLimiteData] = useState(5);
	const { isLoading, mutateAsync } = useCreateDefaultGroup();
	const queryMyCommunity = async (payload) => {
		try {
			if (!mycommmunityLoading) {
				setMycommmunityLoading("loading");
				await getMyCommunityList(payload)
					.then((res) => {
						setMycommmunityLoading(null);
						if (Array.isArray(res)) {
							dispatch(setMyCommunity(res));
						}
					})
					.catch((error) => console.error(error));
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		let abortController = new AbortController();

		let payload = {
			appId,
			token,
		};

		queryMyCommunity(payload);

		return () => {
			abortController.abort();
		};
	}, []);

	const setLIClassName = (index) => {
		return index > limitData ? "hideli" : "";
	};

	const viewAll = () => {
		try {
			if (userRole === "user") {
				dispatch(setPage("myCommunities"));
			}
			if (userRole === "admin") {
				if (!isAll) {
					setLimiteData(myData.length);
					setViewAll(false);
				}
				console.log("allCommunities");
				if (isAll) {
					dispatch(setPage("allCommunities"));
				} else {
					// dispatch(setPage("deletedCommunities"));
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const setCommunity = (item) => {
		try {
			if (userRole === "admin" && !isAll) {
				return false;
			}

			dispatch(setFeeds([]));
			dispatch(setCurrentCommunity({}));
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading feeds ..."));
			dispatch(setMessageBoxCloseBtn(false));

			mutateAsync({
				token,
				appId,
				communityId: item._id,
			}).then((res) => {
				getCommunityDetail({
					communityId: item._id,
					appId,
					token,
				})
					.then(async (response) => {
						if (response && response.status && response.status === 200) {
							dispatch(setCommunityId(item._id));
							const communityUsersWithDetail = await getUsersDetail({
								token,
								userIds: response.data.data.communityUsers,
							}).then((res) => res.data.data);

							dispatch(
								setCurrentCommunity({
									...response.data.data,
									communityUsers: communityUsersWithDetail,
									defaultGroup: res?.data?.data,
								})
							);

							dispatch(setPage("eachcommunity"));
							dispatch(setPost(""));
							dispatch(setCommuinityHeaderTab());

							if (userRole === "user") {
								dispatch(setLoading("Loading all feeds ..."));
								let payload = {
									communityId: item._id,
									count: count,
									page: 1,
									appId,
									token,
								};
								dispatch(hasMoreFeed(false));
								getAllFeed(payload).then((res) => {
									dispatch(setFeeds(res.list));
									dispatch(setFeedIdList(res.list.map((item) => item._id)));
									dispatch(hasMoreFeed(res.metadata.hasMore));
									dispatch(setLoading(false));
									dispatch(setMessageBox(false));
								});
							}
						} else {
							console.error("Error :", response);
							dispatch(setMessageBox(true));
							dispatch(setMessageTxt(response.data.metadata.message));
							dispatch(setMessageBoxCloseBtn(true));
						}
					})
					.catch((error) => {
						console.log("Error on getCommunityDetail", error);
						dispatch(setMessageBox(false));
					});
			});
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<>
			<ul className="communities-list">
				<li>
					<div className="header">
						<div className="title">
							<img
								src={
									process.env.REACT_APP_SITE_URL + "icon-discover-community.svg"
								}
								alt="my communities"
								loading="lazy"
							/>

							<span>{title}</span>
						</div>
					</div>

					<ul>
						{myData &&
							myData.length > 0 &&
							myData.map((item, index) => {
								return (
									index <= limitData - 1 && (
										<li key={item._id} className={setLIClassName(index)}>
											<button onClick={() => setCommunity(item)}>
												<div>
													{item.state && item.state === "Public" && (
														<img
															src={
																process.env.REACT_APP_SITE_URL +
																"icon-globe.svg"
															}
															alt="Public Community"
															title="Public Community"
															loading="lazy"
														/>
													)}
													{item.state && item.state === "Private" && (
														<img
															src={
																process.env.REACT_APP_SITE_URL +
																"icon-lock-light.svg"
															}
															alt="Private Community"
															title="Private Community"
															loading="lazy"
														/>
													)}

													<span> {item.name} </span>
													{item.createdBy === userId && (
														<img
															className="star"
															alt="My Community"
															title="My Community"
															src={
																process.env.REACT_APP_SITE_URL +
																"admin_star.svg"
															}
														/>
													)}
												</div>
												<div>
													{item.communityUsers &&
													item.communityUsers.length > 20 ? (
														<span>20+</span>
													) : (
														<span>{item.communityUsers.length}</span>
													)}
												</div>
											</button>
										</li>
									)
								);
							})}

						{myData.length > limitData && (
							<>
								{viewall && (
									<li>
										<button className="view-all" onClick={() => viewAll()}>
											<img
												src={
													process.env.REACT_APP_SITE_URL +
													"icon-blue-arrow-down.svg"
												}
												alt="view all"
												loading="lazy"
											/>
											View All
										</button>
									</li>
								)}
							</>
						)}
					</ul>
				</li>
			</ul>{" "}
		</>
	);
}
export default React.memo(MyCommunities);
