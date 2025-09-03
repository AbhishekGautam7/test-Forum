import React, { useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
	changeCommunityState,
	deleteCommunity,
	editCommunityBanner,
	fileUploader,
	getAllFeed,
	getMemberList,
	leaveCommmunity,
	setFavoriteCommunity,
} from "../api/community";
import {
	changeStateByAdmin,
	deleteCommunityByAdmin,
	editCommunityBannerByAdmin,
	fetchDeletedFeeds,
	fetchOrgFeeds,
} from "../api/orgAdmin";
import { getAllScheduedPosts, getPastFeeds } from "../api/schedule";
import ConfirmBox from "../components/modules/ConfirmBox";
import InviteUsers from "../components/modules/InviteUsers";
import {
	addFavorite,
	changeCurrentCommunityState,
	changeStateAllCommunity,
	changeStateFavorite,
	changeStateMyCommunity,
	changeStateTodaysCommunity,
	deleteFromAllCommunity,
	deleteMyCommunity,
	hasMoreFeed,
	removeFavorite,
	removeFromTodaysCommunity,
	setCommuinityHeaderTab,
	setCommunityId,
	setConfirmMessageTxt,
	setCurrentCommunity,
	setEditCommunityStatus,
	setFeedIdList,
	setFeeds,
	setFeedsName,
	setInviteUsersStatus,
	setLoading,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	setModal,
	setPage,
	setPost,
	setTotalFeed,
} from "../redux";
import {
	EditIcon,
	FavouriteIcon,
	FavouriteUncheckedIcon,
	InfoIcon,
	InviteIcon,
	TickIcon,
} from "./icons/index";

import { useIsMobileView } from "../hooks";
import { AiOutlineDelete } from "react-icons/ai";
import { useQueryClient } from '@tanstack/react-query';
import Avatar from "./modules/Avatar";
import ShowInfo from "./modules/showInfo";

function CommunityHeader() {
	const banner = useRef(null);
	const currentCommunity = useSelector((state) => state.currentCommunity.data);
	const state = useSelector((state) => state.currentCommunity.data.state);
	const clientId = useSelector((state) => state.info.clientId);
	const orgId = useSelector((state) => state.info.orgId);
	const tenentId = useSelector((state) => state.info.tenentId);
	const oldmembers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const userId = useSelector((state) => state.info.userId);
	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const communityId = useSelector((state) => state.info.communityId);
	const [isOwnCommunity, setIsOwnCommunity] = useState(false);
	const [hasOwnFeed, setHasOwnFeed] = useState(false);
	const dispatch = useDispatch();
	const [loadingImg, setLoadingImg] = useState("");
	const [members, setMember] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(null);
	const [loadingSchedulePosts, setLoadingSchedulePosts] = useState(null);
	const count = useSelector((state) => state.feeds.perPageFeed);
	const [changeStateStatus, setChangeStateStatus] = useState(false);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);
	const inviteUsersStatus = useSelector(
		(state) => state.info.inviteUsersStatus
	);
	const createdby = useSelector(
		(state) => state.currentCommunity.data.createdBy
	);
	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const todaysCommunity = useSelector((state) => state.todaysCommunity.data);
	const allCommunity = useSelector((state) => state.allCommunity.data);
	const myCommunity = useSelector((state) => state.myCommunity.data);
	const userRole = useSelector((state) => state.myProfile.data.role);
	const [confirmBoxStatus, setConfirmBoxStatus] = useState(false);
	const [confirmBoxName, setConfirmBoxName] = useState("");

	const [showInfo, setShowInfo] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		try {
			if (createdby) {
				// setCreatedBy(currentCommunity.createdBy);
				setIsOwnCommunity(() => createdby === userId);
				if (state.feeds && state.feeds.length > 0) {
					setHasOwnFeed(
						state.feeds.filter((item) => item.createdBy === userId).length > 0
					);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}, [communityId, userId, createdby, state, communityUsers]);
	const showMsg = (obj) => {
		try {
			dispatch(setInviteUsersStatus(false));

			dispatch(setMessageBox(true));
			dispatch(setMessageTxt(obj.msg));
			dispatch(setMessageBoxCloseBtn(true));
		} catch (error) {
			console.error(error);
		}
	};
	const confirmDeleteCommunity = () => {
		dispatch(setModal(false));
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		removeCommunity();
	};

	const confirmDelete = () => {
		try {
			switch (confirmBoxName) {
				case "deleteCommunity":
					confirmDeleteCommunity();
					break;
				case "leaveCommunity":
					leaveCommmunityAPI();
					break;
			}
		} catch (error) {
			console.error(error);
		}
	};
	const hideConfirmBox = () => {
		try {
			dispatch(setModal(false));
			dispatch(setConfirmMessageTxt(""));
			setConfirmBoxStatus(false);
		} catch (error) {
			console.error(error);
		}
	};
	/* Upload Banner */
	const uploadBanner = (e) => {
		try {
			if (loadingImg !== "loading") {
				setLoadingImg("loading");
			}
			if (loadingImg == "") {
				fileUploader(e.target.files[0]).then((res) => {
					setLoadingImg("");

					// editCommunityBanner
					let payload = {
						bannerImage:
							res &&
							res.data &&
							res.data.data &&
							res.data.data.length > 0 &&
							res.data.data[0].fileToSend &&
							res.data.data[0].fileToSend.Location
								? res.data.data[0].fileToSend.Location
								: "",

						userId,
						communityId: communityId ? communityId : null,
						token,
						appId,
					};

					var cloneCommunity = { ...currentCommunity };

					if (userRole === "user") {
						editCommunityBanner(payload)
							.then((res) => {
								if (res.status === 200) {
									cloneCommunity.bannerImage = res.data.data.bannerImage;
									dispatch(setCurrentCommunity(cloneCommunity));
								}
							})
							.catch((error) => console.error(error.response));
					} else if (userRole === "admin") {
						editCommunityBannerByAdmin(payload)
							.then((res) => {
								if (res.status === 200) {
									cloneCommunity.bannerImage = res.data.data.bannerImage;
									dispatch(setCurrentCommunity(cloneCommunity));
								}
							})
							.catch((error) => console.error(error.response));
					}
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const fetchUserList = () => {
		try {
			if (!loadingUsers) {
				setLoadingUsers("loading");
				getMemberList({ orgId, token, appId })
					.then((res) => {
						setMember(() => res);
						dispatch(setInviteUsersStatus(true));
						setLoadingUsers(null);
					})
					.catch((error) => {
						console.error(error);
						setLoadingUsers(null);
					});
			}
		} catch (error) {
			console.error(error);
		}
	};
	const confirmRemoveCommunity = () => {
		try {
			dispatch(setModal(true));
			dispatch(
				setConfirmMessageTxt(
					"Are you sure you want to delete this community ? "
				)
			);
			setConfirmBoxStatus(true);
			setConfirmBoxName("deleteCommunity");
		} catch (error) {
			console.error(error);
		}
	};
	const confirmLeaveCommunityBox = () => {
		try {
			dispatch(setModal(true));
			dispatch(
				setConfirmMessageTxt("Are you sure you want to leave this community ? ")
			);
			setConfirmBoxStatus(true);
			setConfirmBoxName("leaveCommunity");
		} catch (error) {
			console.error(error);
		}
	};
	const fetchPosts = () => {
		try {
			dispatch(setFeeds([]));
			dispatch(setPost(""));
			dispatch(setCommuinityHeaderTab("conversations"));
			dispatch(hasMoreFeed(false));
			let payload = {
				userId,
				orgId,
				clientId,
				tenentId,
				communityId,
				token,
				appId,
				count,
			};

			payload.isOrgAdmin = userRole === "admin";

			if (!loadingSchedulePosts) {
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading Conversations Posts ..."));
				dispatch(setMessageBoxCloseBtn(false));
				setLoadingSchedulePosts("Loading Conversations Posts");
				dispatch(setLoading("Loading Conversations Posts ..."));
				if (userRole === "admin") {
					fetchOrgFeeds(payload)
						.then((res) => {
							dispatch(setMessageBox(false));
							setLoadingSchedulePosts(null);
							dispatch(setLoading(false));

							if (res) {
								dispatch(setFeeds(res.list));
								dispatch(setFeedIdList(res.list.map((item) => item._id)));
								dispatch(hasMoreFeed(res.metadata.hasMore));
								dispatch(setTotalFeed(res.metadata.total));
								dispatch(setMessageBox(false));
							}
						})
						.catch((error) =>
							console.error("Error from fetch org feeds", error)
						);
				} else {
					getAllFeed(payload)
						.then((res) => {
							dispatch(setMessageBox(false));
							setLoadingSchedulePosts(null);
							dispatch(setLoading(false));
							if (res) {
								if (res && res.list) {
									dispatch(setFeeds(res.list));
									dispatch(setFeedIdList(res.list.map((item) => item._id)));
								}

								dispatch(setMessageBox(false));
								dispatch(setFeedsName("conversations"));
								dispatch(hasMoreFeed(res.metadata.hasMore));
								dispatch(setTotalFeed(res.metadata.total));
							}
						})
						.catch((error) => {
							console.error(error);
							dispatch(
								setMessageTxt("Someting went wrong while fetching feeds.")
							);
							dispatch(setMessageBoxCloseBtn(true));
						});
				}
			}
		} catch (error) {
			console.error(error);
		}
	};
	const fetchAllSchedulePosts = () => {
		try {
			dispatch(setFeeds([]));
			dispatch(setPost(""));
			dispatch(setCommuinityHeaderTab("scheduled"));
			dispatch(hasMoreFeed(false));
			let payload = { communityId, token, appId };

			payload.isOrgAdmin = userRole === "admin";

			if (!loadingSchedulePosts) {
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading Schedule Posts ..."));
				dispatch(setMessageBoxCloseBtn(false));
				dispatch(setLoading("Loading all schedule posts ..."));
				setLoadingSchedulePosts("Loading all schedule posts");
				getAllScheduedPosts(payload)
					.then((res) => {
						dispatch(setLoading(false));
						dispatch(setMessageBox(false));
						setLoadingSchedulePosts(null);
						dispatch(setMessageBox(false));
						dispatch(setFeeds(res.list));
						dispatch(setMessageBoxCloseBtn(true));
						dispatch(setFeedsName("scheduled"));
						payload.feedListName = "scheduled";
						dispatch(setFeedIdList(res.list.map((item) => item._id)));
						dispatch(hasMoreFeed(res.metadata.hasMore));
					})
					.catch((error) => {
						console.error(error);
						dispatch(
							setMessageTxt(
								"Someting went wrong while fetching scheduled feeds."
							)
						);
						dispatch(setMessageBoxCloseBtn(true));
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const fetchPastFeeds = () => {
		try {
			dispatch(setFeeds([]));
			dispatch(setPost(""));
			dispatch(setCommuinityHeaderTab("past"));
			dispatch(hasMoreFeed(false));

			let payload = { communityId, token, appId };

			payload.isOrgAdmin = userRole === "admin";

			if (!loadingSchedulePosts) {
				dispatch(setLoading("Loading Past Feeds ..."));
				setLoadingSchedulePosts("Loading Past Feeds");
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading Past Feeds ..."));
				dispatch(setMessageBoxCloseBtn(false));
				getPastFeeds(payload)
					.then((response) => {
						setLoadingSchedulePosts(null);
						dispatch(setFeedsName("past"));
						dispatch(setFeeds(response.list));
						dispatch(setMessageBox(false));
						dispatch(setLoading(false));
						payload.feedListName = "ended";
						dispatch(setFeedIdList(response.list.map((item) => item._id)));
						dispatch(hasMoreFeed(response.metadata.hasMore));
					})
					.catch((error) => {
						console.error(error);
						dispatch(
							setMessageTxt(
								"Someting went wrong while fetching scheduled feeds."
							)
						);
						dispatch(setMessageBoxCloseBtn(true));
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const fetchDeleted = () => {
		try {
			dispatch(setFeeds([]));
			dispatch(setPost(""));
			dispatch(setCommuinityHeaderTab("deleted"));
			dispatch(hasMoreFeed(false));
			let payload = { communityId, token, appId };
			payload.isOrgAdmin = userRole === "admin";
			if (!loadingSchedulePosts) {
				dispatch(setLoading("Loading Deleted Feeds ..."));
				setLoadingSchedulePosts("Loading Deleted Feeds");
				dispatch(setMessageBox(true));
				dispatch(setMessageTxt("Loading Deleted Feeds ..."));
				dispatch(setMessageBoxCloseBtn(false));
				fetchDeletedFeeds(payload)
					.then((response) => {
						setLoadingSchedulePosts(null);
						dispatch(setFeeds(response.list));
						dispatch(setLoading(false));
						dispatch(setMessageBox(false));
						dispatch(setFeedsName("deleted"));
						dispatch(setFeedIdList(response.list.map((item) => item._id)));
						dispatch(hasMoreFeed(response.metadata.hasMore));
					})
					.catch((error) => {
						dispatch(
							setMessageTxt("Someting went wrong while fetching delted feeds.")
						);
						dispatch(setMessageBoxCloseBtn(true));
					});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const removeCommunity = () => {
		try {
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Deleting community ... "));
			dispatch(setMessageBoxCloseBtn(false));
			if (userRole === "user") {
				deleteCommunity({
					communityId: communityId,
					token,
					appId,
				})
					.then((response) => {
						if (response.status === 200) {
							dispatch(setCommunityId(null));

							dispatch(deleteMyCommunity(communityId));

							dispatch(setPost(""));

							if (currentCommunity.isFavourite) {
								dispatch(removeFavorite(communityId));
							}
							dispatch(setCurrentCommunity({}));

							getAllFeed({ token, appId })
								.then((res) => {
									dispatch(setFeeds(res.list));
									dispatch(setFeedIdList(res.list.map((item) => item._id)));
									dispatch(setPage("home"));
									dispatch(setMessageTxt("Successfully deleted"));
									dispatch(setMessageBoxCloseBtn(true));
									dispatch(hasMoreFeed(res.metadata.hasMore));
									dispatch(setTotalFeed(res.metadata.total));
								})
								.catch((error) => console.error(error.response));
						} else {
							dispatch(setMessageBox(true));
							dispatch(setMessageTxt(response.data.metadata.message));
							dispatch(setMessageBoxCloseBtn(true));
						}
					})
					.catch((error) => {
						console.error("Error on deleteCommunity", error);
					});
			} else if (userRole === "admin") {
				deleteCommunityByAdmin({
					communityId,
					appId,
					token,
				})
					.then((response) => {
						if (response.status === 200) {
							dispatch(setCommunityId(null));

							// dispatch(deleteMyCommunity(communityId));
							dispatch(deleteFromAllCommunity(communityId));

							dispatch(setPost(""));
							dispatch(setCurrentCommunity({}));

							const isTodaysCommunity = todaysCommunity.find(
								(community) => community._id == communityId
							);

							if (isTodaysCommunity)
								dispatch(removeFromTodaysCommunity(communityId));

							fetchOrgFeeds({ token, appId })
								.then((res) => {
									dispatch(setFeeds(res.list));
									dispatch(setFeedIdList(res.list.map((item) => item._id)));
									dispatch(setPage("home"));
									dispatch(setMessageTxt("Successfully deleted"));
									dispatch(setMessageBoxCloseBtn(true));
									dispatch(hasMoreFeed(res.metadata.hasMore));
									dispatch(setTotalFeed(res.metadata.total));
								})
								.catch((error) => console.error(error.response));
						} else {
							dispatch(setMessageBox(true));
							dispatch(setMessageTxt(response.data.metadata.message));
							dispatch(setMessageBoxCloseBtn(true));
						}
					})
					.catch((error) => {
						console.error("Error on deleteCommunity", error);
					});
			}
			queryClient.invalidateQueries("communityList");
		} catch (error) {
			console.error(error);
		}
	};
	const readyEditCommunity = () => {
		try {
			dispatch(setEditCommunityStatus(true));
			dispatch(setModal(true));
		} catch (error) {
			console.error(error);
		}
	};

	const displayInfo = () => {
		try {
			setShowInfo(true);
			dispatch(setModal(true));
		} catch (error) {
			console.log(error);
		}
	};
	const changeState = () => {
		try {
			if (changeStateStatus === true) {
				return false;
			}
			setChangeStateStatus(true);
			let payload = {
				userId,
				communityId,
				appId,
				token,
			};

			if (userRole === "user") {
				changeCommunityState(payload)
					.then((response) => {
						setChangeStateStatus(false);
						if (
							(response &&
								response.metadata &&
								response.metadata.statusCode &&
								response.metadata.statusCode === 200,
							response.data,
							response.data.data,
							response.data.data.state)
						) {
							let cloneCommunity = { ...currentCommunity };
							cloneCommunity.state = response.data.data.state;

							dispatch(changeCurrentCommunityState(response.data.data.state));

							myCommunity &&
								myCommunity.length > 0 &&
								response &&
								response.data &&
								response.data.data &&
								response.data.data.state &&
								dispatch(
									changeStateMyCommunity({
										communityId: communityId,
										state: response.data.data.state,
									})
								);

							if (currentCommunity.isFavourite) {
								dispatch(
									changeStateFavorite({
										communityId: communityId,
										state: response.data.data.state,
									})
								);
							}
						}
					})
					.catch((error) => {
						console.error(error);
						setChangeStateStatus(false);
					});
			} else if (userRole === "admin") {
				changeStateByAdmin(payload)
					.then((response) => {
						setChangeStateStatus(false);
						if (
							(response &&
								response.metadata &&
								response.metadata.statusCode &&
								response.metadata.statusCode === 200,
							response.data,
							response.data.data,
							response.data.data.state)
						) {
							let cloneCommunity = { ...currentCommunity };
							cloneCommunity.state = response.data.data.state;

							dispatch(changeCurrentCommunityState(response.data.data.state));
							// Change State on All Community
							if (allCommunity && allCommunity.length > 0) {
								dispatch(
									changeStateAllCommunity({
										communityId: communityId,
										state:
											response &&
											response.data &&
											response.data.data &&
											response.data.data.state
												? response.data.data.state
												: "",
									})
								);
							}

							// Change State on Todays Community
							if (todaysCommunity && todaysCommunity.length > 0) {
								dispatch(
									changeStateTodaysCommunity({
										communityId: communityId,
										state:
											response &&
											response.data &&
											response.data.data &&
											response.data.data.state
												? response.data.data.state
												: "",
									})
								);
							}
						}
					})
					.catch((error) => {
						console.error(error);
						setChangeStateStatus(false);
					});
			}
		} catch (error) {
			console.error(error);
		}
	};
	const leaveCommmunityAPI = () => {
		try {
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Leaving from Community ..."));
			dispatch(setMessageBoxCloseBtn(false));
			leaveCommmunity({
				userId,
				orgId,
				clientId,
				tenentId,
				token,
				appId,
				communityId,
			}).then((response) => {
				getAllFeed({
					userId,
					orgId,
					clientId,
					tenentId,
					token,
					appId,
				})
					.then((res) => {
						dispatch(setFeeds(res.list));
						dispatch(setMessageTxt("Successfully Left Community"));
						dispatch(setMessageBoxCloseBtn(true));

						dispatch(setPage("home"));
						dispatch(setCommunityId(null));
						dispatch(setCurrentCommunity({}));
						dispatch(setPost(""));
						dispatch(setCommuinityHeaderTab(""));
						dispatch(deleteMyCommunity(communityId));
						if (currentCommunity.isFavourite) {
							dispatch(removeFavorite(communityId));
						}
						dispatch(setFeedIdList(res.list.map((item) => item._id)));
						dispatch(hasMoreFeed(res.metadata.hasMore));
						dispatch(setTotalFeed(res.metadata.totalCount));
						queryClient.invalidateQueries("communityList");
					})
					.catch((error) => {
						console.error(error);
						dispatch(
							setMessageTxt("Something went wrong while leaving community")
						);
						dispatch(setMessageBoxCloseBtn(true));
					});
			});
		} catch (error) {
			console.error(error);
		}
	};
	const setFavorite = () => {
		try {
			let payload = {
				communityId,
				userId,
				createdBy: createdby,
				token,
				appId,
			};
			setFavoriteCommunity(payload)
				.then((response) => {
					if (response.status === 200) {
						let currentComm = response.data.data;
						currentComm.communityUsers = currentCommunity.communityUsers;
						dispatch(setCurrentCommunity(currentComm));
						dispatch(setMessageBox(true));
						dispatch(setMessageTxt(response.data.metadata.message));
						dispatch(setMessageBoxCloseBtn(true));
						let data = {
							communityId: communityId,
							communityName: currentCommunity.name,
							isActive: true,
							userCount: currentCommunity.communityUserCount,
							usersArray: currentCommunity.communityUsers,
							state: currentCommunity.state,
							createdBy: response?.data?.data?.createdBy
								? response.data.data.createdBy
								: "",
						};
						if (response.data.data.isFavourite) {
							dispatch(addFavorite(data));
						} else {
							dispatch(removeFavorite(data.communityId));
						}
					} else {
						dispatch(setMessageBox(true));
						dispatch(setMessageTxt(response.data.metadata.message));
						dispatch(setMessageBoxCloseBtn(true));
					}
				})
				.catch((error) =>
					console.error("Error on setFavoriteCommunity ,", error)
				);
		} catch (error) {
			console.error(error);
		}
	};

	const { isMobileView } = useIsMobileView({});

	return (
		<>
			<div className="common-box">
				<div className="default-cover-holder">
					<div className="cover-wrap">
						<img
							src={
								currentCommunity && currentCommunity.bannerImage
									? currentCommunity.bannerImage
									: process.env.REACT_APP_SITE_URL + "morning.jpg"
							}
							alt="coverImage"
						/>
					</div>
					{(isOwnCommunity || userRole === "admin") && !isMobileView && (
						<>
							<input
								type="file"
								accept="image/png, image/gif, image/jpeg, image/jpg"
								className="d-none"
								ref={banner}
								onChange={(e) => uploadBanner(e)}
							/>
							<button
								className="edit-cover-btn"
								onClick={() => banner.current.click()}
							>
								<img
									src={process.env.REACT_APP_SITE_URL + "icon-camera-light.svg"}
									alt="icon"
									loading="lazy"
								/>
								{loadingImg === "loading"
									? "Uploading Images ..."
									: "Edit Cover Photo"}
							</button>
						</>
					)}

					<div className="px-3  default-community-header">
						<div className="public-wrap">
							<div className="public-member d-flex align-items-center gap-3 ">
								<div className="d-flex align-items-center gap-1">
									{currentCommunity &&
										currentCommunity.state &&
										currentCommunity.state === "Public" && (
											<img
												src={process.env.REACT_APP_SITE_URL + "icon-globe.svg"}
												alt="Public Community"
												title="Public Community"
												loading="lazy"
												style={{
													width: "0.8rem",
													height: "0.8rem",
												}}
											/>
										)}
									{currentCommunity &&
										currentCommunity.state &&
										currentCommunity.state === "Private" && (
											<img
												src={
													process.env.REACT_APP_SITE_URL + "icon-lock-light.svg"
												}
												alt="Private Community"
												title="Private Community"
												loading="lazy"
												style={{
													width: "0.8rem",
													height: "0.8rem",
												}}
											/>
										)}

									<span className="public-member-title">
										{currentCommunity &&
											currentCommunity.state &&
											currentCommunity.state}
									</span>
								</div>
								<span className="d-flex align-items-center gap-1 public-member-title">
									<span className="d-flex">
										{communityUsers &&
											communityUsers?.slice(0, 3)?.map?.((user) => (
												<div key={user?._id}>
													<Avatar
														alt="user"
														fullName={
															user?.name ||
															user?.firstName + " " + user?.lastName
														}
														initialsFontSize="0.5rem"
														size="15px"
														src={user?.img}
													/>
												</div>
											))}
									</span>
									{communityUsers && communityUsers.length}

									{communityUsers && communityUsers.length > 1
										? " Members"
										: " Member"}
								</span>
							</div>
							{currentCommunity && currentCommunity.name && (
								<h4 className="public-title">{currentCommunity.name}</h4>
							)}
						</div>
						<div className="public-btn-wrap">
							<div className="common-btn-joined">
								<TickIcon />
							</div>
							{userRole === "user" && (
								<button
									className={
										currentCommunity.isFavourite
											? "common-btn-favourite"
											: "common-btn-unliked"
									}
									onClick={() => setFavorite()}
								>
									{currentCommunity.isFavourite ? (
										<FavouriteIcon />
									) : (
										<FavouriteUncheckedIcon />
									)}
								</button>
							)}
							{(isOwnCommunity || userRole === "admin") && (
								<button
									className="common-btn-invite"
									data-bs-toggle="modal"
									data-bs-target="#inviteModal"
									onClick={() => fetchUserList()}
									disabled={loadingUsers}
								>
									<InviteIcon />

									{/* {!loadingUsers ? "Invite" : "... Loading Users"} */}
								</button>
							)}
							{(isOwnCommunity || userRole === "admin") && (
								<>
									<div
										className="common-btn-edit"
										onClick={() => readyEditCommunity()}
									>
										<EditIcon />
									</div>

									<div
										className="common-btn-delete"
										onClick={() => confirmRemoveCommunity()}
									>
										<AiOutlineDelete />
									</div>
								</>
							)}

							<div
								className="common-btn-info"
								data-bs-toggle="modal"
								data-bs-target="#showInfo"
								onClick={displayInfo}
							>
								<InfoIcon />
							</div>

							{!isOwnCommunity && userRole === "user" && (
								<button
									className="common-btn-leave"
									data-bs-toggle="modal"
									data-bs-target="#inviteModal"
									onClick={() => confirmLeaveCommunityBox()}
								>
									<CiLogout />
								</button>
							)}
						</div>
					</div>
				</div>
				{/* JSON.stringify(currentCommunity) */}

				<div className="default-community-navbar">
					<ul className="default-nav-list">
						<li>
							<button
								className={
									communityHeaderTab === "conversations" ? "active" : ""
								}
								onClick={() => fetchPosts()}
								style={{
									fontSize: isMobileView ? "0.7rem" : "0.9rem",
								}}
							>
								Conversations
							</button>
						</li>
						<li>
							<button
								style={{
									fontSize: isMobileView ? "0.7rem" : "0.9rem",
								}}
								className={communityHeaderTab === "scheduled" ? "active" : ""}
								onClick={() => fetchAllSchedulePosts()}
							>
								Scheduled
							</button>
						</li>
						<li>
							<button
								style={{
									fontSize: isMobileView ? "0.7rem" : "0.9rem",
								}}
								className={communityHeaderTab === "past" ? "active" : ""}
								onClick={() => fetchPastFeeds()}
							>
								Ended
							</button>
						</li>
						{(isOwnCommunity ||
							userRole === "admin" ||
							hasOwnFeed === true) && (
							<li>
								<button
									style={{
										fontSize: isMobileView ? "0.7rem" : "0.9rem",
									}}
									className={communityHeaderTab === "deleted" ? "active" : ""}
									onClick={() => fetchDeleted()}
								>
									Deleted
								</button>
							</li>
						)}
					</ul>

					{/* <ul className="default-icon-list">
						{userRole === "user" && (
							<li>
								<button className="common-btn" onClick={() => setFavorite()}>
									{currentCommunity.isFavourite ? (
										<img
											src={process.env.REACT_APP_SITE_URL + "red-heart.svg"}
											alt="favourite"
											loading="lazy"
										/>
									) : (
										<img
											src={
												process.env.REACT_APP_SITE_URL + "icon-favourites.svg"
											}
											alt="favourite"
											loading="lazy"
										/>
									)}
								</button>
							</li>
						)}

						{(isOwnCommunity || userRole === "admin") && (
							<li>
								<button className="common-btn dropdown-toggle">
									<img
										src={
											process.env.REACT_APP_SITE_URL + "icon-black-ellipsis.svg"
										}
										alt="favourite"
										loading="lazy"
									/>
								</button>
								<ul className="dropdown-menu dropdown-menu-end default-config-dropdown">
									<li>
										<div
											className="img-wrap"
											onClick={() => readyEditCommunity()}
										>
											<img
												src={
													process.env.REACT_APP_SITE_URL + "icon-settings.svg"
												}
												alt="icon"
												loading="lazy"
											/>
											<span className="a">Edit</span>
										</div>
									</li>

							

					{/* <li> */}
					{/* <div className="img-wrap">
											<img
												src={process.env.REACT_APP_SITE_URL + "icon-lock.svg"}
												alt="icon"
												loading="lazy"
											/>
											<span className="a">Private</span>
										</div> */}
					{/* 
										<label className="common-switch">
											<input
												type="checkbox"
												onChange={(e) => changeState(e)}
												checked={currentCommunity.state === "Private"}
											/>
											<span className="slider round"></span>
										</label> */}
					{/* </li> */}
					{/* </ul> */}
					{/* </li> */}
					{/* // )} */}
					{/* // </ul> */}
				</div>
			</div>
			{showInfo && (
				<ShowInfo
					setShowInfo={setShowInfo}
					description={currentCommunity?.description}
				/>
			)}
			{inviteUsersStatus && members && members.length > 0 && (
				<InviteUsers
					members={members}
					oldmembers={oldmembers}
					onMessage={(msg) => showMsg(msg)}
				/>
			)}
			{confirmBoxStatus ? (
				<ConfirmBox onYes={confirmDelete} onNo={hideConfirmBox} />
			) : (
				""
			)}
		</>
	);
}
export default React.memo(CommunityHeader);
