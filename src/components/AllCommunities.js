import React, { useEffect, useState, useRef } from "react";
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
	setAllCommunityStatus,
	setFeedsName,
	setTotalFeed,
} from "../redux";

import { getCommunityDetail, getUsersDetail } from "../api/community";
import { fetchOrgFeeds, getAllCommunity } from "../api/orgAdmin";
import { useCreateDefaultGroup } from "./chats/hooks";

function AllCommunities(props) {
	const dispatch = useDispatch();
	const title = props.title;
	const [data, setData] = useState(
		useSelector((state) => state?.allCommunity?.data)
	);
	const userId = useSelector((state) => state.info.userId);
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const userRole = useSelector((state) => state.myProfile.data.role);
	const allCommunity = useSelector((state) => state.allCommunity);
	const isAll = useSelector((state) => state.allCommunity.status);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const [viewall, setViewAll] = useState(true);
	const [limitData, setLimiteData] = useState(5);
	const checkBoxInput = useRef(null);
	const { isLoading, mutateAsync } = useCreateDefaultGroup();

	/*
  useEffect(() => {
    let abortController = new AbortController();
    queryAllCommunity();
    return () => {
      abortController.abort();
    };
  }, []);
*/
	useEffect(() => {
		setData(allCommunity?.data);
	}, [allCommunity]);
	useEffect(() => {
		let abortController = new AbortController();
		queryAllCommunity();
		return () => {
			abortController.abort();
		};
	}, [isAll]);

	const setLIClassName = (index) => {
		return !isAll ? "deleted" : "";
	};
	const queryAllCommunity = async () => {
		try {
			let date = new Date();
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();

			// const currentDate = date.toLocaleDateString();
			const currentDate = year + "-" + month + "-" + day;

			let payload = {
				currentDate,
				deleted: !isAll,
				token,
				appId,
			};
			console.log(payload);
			// console.log(payload);
			await getAllCommunity(payload)
				.then((res) => {
					if (!isAll) {
						setData(res);
					} else {
						setData(res);
					}
				})
				.catch((error) => console.error(error));
		} catch (error) {
			console.error(error);
		}
	};
	const checkBoxEvenetHandler = (event) => {
		dispatch(setAllCommunityStatus(event.target.checked));

		setLimiteData(5);
		setViewAll(true);
	};

	const viewAll = () => {
		try {
			if (userRole === "user") {
				dispatch(setPage("myCommunities"));
			}
			if (userRole === "admin") {
				if (!isAll) {
					setLimiteData(data.length);
					setViewAll(false);
				}
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
					token,
					appId,
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

							if (userRole === "admin") {
								dispatch(setLoading("Loading all feeds ..."));
								dispatch(hasMoreFeed(false));
								fetchOrgFeeds({
									communityId: item._id,
									count: count,
									appId,
									token,
								})
									.then((res) => {
										dispatch(setFeeds(res.list));
										dispatch(setLoading(false));
										dispatch(setFeedIdList(res.list.map((item) => item._id)));
										dispatch(hasMoreFeed(res.metadata.hasMore));
										dispatch(setMessageBox(false));
										dispatch(setFeedsName("home"));
										dispatch(setTotalFeed(res.metadata.totalCount));
									})
									.catch((error) => console.error(error));
							}
						} else {
							console.error("Error :", response);
							dispatch(setMessageBox(true));
							dispatch(setMessageTxt(response.data.metadata.message));
							dispatch(setMessageBoxCloseBtn(true));
						}
					})
					.catch((error) => {
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

							<span>{isAll ? title : "All Deleted Communities"}</span>
						</div>
						{userRole === "admin" && (
							<div className="deleteCheck">
								<label>
									<span>Deleted</span>
									<input
										type="checkbox"
										checked={isAll}
										ref={checkBoxInput}
										onChange={() => console.log("")}
										onClick={(e) => checkBoxEvenetHandler(e)}
									></input>
									<b></b>
								</label>
							</div>
						)}
					</div>

					<ul>
						{data &&
							data.length > 0 &&
							data.map((item, index) => {
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
					</ul>
				</li>
			</ul>{" "}
		</>
	);
}
export default AllCommunities;
