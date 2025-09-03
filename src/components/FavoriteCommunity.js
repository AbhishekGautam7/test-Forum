import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	setCommunityId,
	setCurrentCommunity,
	setPage,
	setPost,
	setCommuinityHeaderTab,
	setFeeds,
	setLoading,
	setMessageBox,
	setMessageTxt,
	setFavorite,
	setFeedIdList,
	hasMoreFeed,
} from "../redux";
import { useDispatch, useSelector } from "react-redux";
import {
	getCommunityDetail,
	getAllFeed,
	getFavoriteCommunityList,
	getUsersDetail,
} from "../api/community";
import { useCreateDefaultGroup } from "./chats/hooks/useCreateDefaultGroup";
function FavoriteCommunity(props) {
	const data = useSelector((state) => state.favorite.data);
	const title = props.title;
	const userId = useSelector((state) => state.info.userId);
	const dispatch = useDispatch();
	const [viewall, setViewAll] = useState(true);
	const [limitData, setLimiteData] = useState(5);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const { isLoading, mutateAsync } = useCreateDefaultGroup();

	useEffect(() => {
		let abortController = new AbortController();
		queryFavoriteCommunityList({
			appId,
			token,
		});
		return () => {
			abortController.abort();
		};
	}, []);

	const viewAll = () => {
		dispatch(setPage("favoriteCommunities"));
	};
	const viewLess = () => {
		setLimiteData(5);
		setViewAll(true);
	};
	const queryFavoriteCommunityList = async (payload) => {
		try {
			dispatch(hasMoreFeed(false));
			await getFavoriteCommunityList(payload)
				.then((res) => {
					if (res && res.status && res.status === 200) {
						console.log(res.data.data);
						dispatch(setFavorite(res.data.data));
						// setData(res.data.data);
					} else {
						console.log("Something error on queryFavoriteCommunityList");
					}
					// dispatch(setFavorite(res));
				})
				.catch((error) => {
					console.log("Error on getFavoriteCommunityList", error);
				});
		} catch (error) {
			console.error(error);
		}
	};
	const setCommunity = (item) => {
		console.log("setCommunity.............", item);
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Loading feeds ..."));
		dispatch(setFeeds([]));
		mutateAsync({
			token,
			appId,
			communityId: item._id,
		}).then((res) => {
			getCommunityDetail({
				communityId: item.communityId,
				appId,
				token,
			})
				.then(async (response) => {
					console.log("getCommunityDetail", response);

					if (response && response.status && response.status === 200) {
						dispatch(setCommunityId(item.communityId));
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
					}
					dispatch(setLoading("Loading all feeds ..."));
					console.log("communityid", item.communityId);
					getAllFeed({
						communityId: item.communityId,
						appId,
						token,
					}).then((response) => {
						console.log("Filling Feeds from fav ....", response);

						dispatch(setFeeds(response.list));
						dispatch(setFeedIdList(response.list.map((item) => item._id)));
						dispatch(hasMoreFeed(response.metadata.hasMore));
						dispatch(setLoading(false));
						dispatch(setMessageBox(false));
					});
				})
				.catch((error) => {
					console.log("Error on getCommunityDetail", error);
					dispatch(setMessageBox(false));
				});
		});
	};
	return (
		<ul className="communities-list">
			<li>
				<div className="title">
					<img
						src={process.env.REACT_APP_SITE_URL + "icon-favourites.svg"}
						alt="favourite"
						loading="lazy"
					/>
					<span>
						{data && data.length === 0 && <b>No</b>} {title}
					</span>
				</div>
				<ul>
					{data &&
						data.length > 0 &&
						data.map((item, index) => {
							return (
								index <= limitData - 1 && (
									<li key={item.communityId} onClick={() => setCommunity(item)}>
										<button>
											<div>
												{item.state && item.state === "Public" && (
													<img
														src={
															process.env.REACT_APP_SITE_URL + "icon-globe.svg"
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
												<span>{item.communityName}</span>
												{item.createdBy === userId && (
													<img
														className="star"
														alt="Favorite Community"
														title="Favorite Community"
														src={
															process.env.REACT_APP_SITE_URL + "admin_star.svg"
														}
													/>
												)}
											</div>
											<div>
												<span>
													{item && item.usersArray && item.usersArray.length}
												</span>
											</div>
										</button>
									</li>
								)
							);
						})}

					{data.length > limitData && (
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

					{viewall === false && (
						<li>
							<button className="view-all less" onClick={() => viewLess()}>
								<img
									src={
										process.env.REACT_APP_SITE_URL + "icon-blue-arrow-down.svg"
									}
									alt="view less"
									loading="lazy"
								/>
								View Less
							</button>
						</li>
					)}
				</ul>
			</li>
		</ul>
	);
}
FavoriteCommunity.propTypes = {
	title: PropTypes.string,
};
export default React.memo(FavoriteCommunity);
