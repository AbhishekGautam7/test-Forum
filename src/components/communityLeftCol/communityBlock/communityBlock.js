import { Avatar } from "../../modules";

import { useDispatch, useSelector } from "react-redux";

import { fetchOrgFeeds } from "../../../api/orgAdmin";

import {
	CommunityAdminIcon,
	FavouriteIcon,
	MessageIcon,
	PostIcon,
	PublicIcon,
} from "../..//icons";

import {
	hasMoreFeed,
	setCommuinityHeaderTab,
	setCommunityId,
	setCurrentCommunity,
	setFeedIdList,
	setFeeds,
	setFeedsName,
	setLoading,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	setPage,
	setPost,
	setTotalFeed,
} from "../../../redux";

import { getAllFeed, getCommunityDetail, getUsersDetail } from "../../../api/community";

import { useCreateDefaultGroup } from "../../chats/hooks";
import useChatStore from "../../../stores/chatStore";

const CommunityBlock = ({
	isMobile,
	community,
	setTabIndex,
	setHideSidebar,
	setMyFeedActive,
	selectedcommunityId,
	setSelectedCommunityId,
}) => {
	const count = useSelector((state) => state.feeds.perPageFeed);

	const dispatch = useDispatch();

	const token = useSelector((state) => state.info.token);
	const appId = useSelector((state) => state.info.appId);
	const userRole = useSelector((state) => state.myProfile.data.role);
	const currentCommunity = useSelector((state) => state.currentCommunity);

	const { mutateAsync } = useCreateDefaultGroup();

	const {
		setIsCreateGroupFormOpen,
		setIsGroupDetailBoxOpen,
		setIsGroupSettingBoxOpen,
		setIsAddOrRemoveGroupMembersBoxOpen,
		setIsMyFeedButtonClicked,
	} = useChatStore((store) => store);

	const resetAllState = () => {
		setIsCreateGroupFormOpen(false);
		setIsGroupDetailBoxOpen(false);
		setIsGroupSettingBoxOpen(false);
		setIsAddOrRemoveGroupMembersBoxOpen(false);
	};

	const setCommunity = (community) => {
		try {
			setMyFeedActive(false);
			setIsMyFeedButtonClicked(false);

			if (setHideSidebar) {
				setHideSidebar(true);
			}

			resetAllState();
			setSelectedCommunityId(community._id);
			dispatch(setFeeds([]));
			dispatch(setCurrentCommunity({}));
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading feeds ..."));
			dispatch(setMessageBoxCloseBtn(false));

			dispatch(setFeeds([]));
			dispatch(setCurrentCommunity({}));
			dispatch(setMessageBox(true));
			dispatch(setMessageTxt("Loading feeds ..."));
			dispatch(setMessageBoxCloseBtn(false));

			mutateAsync({
				token,
				appId,
				communityId: community._id,
			}).then((res) => {
				getCommunityDetail({
					communityId: community._id,
					appId,
					token,
				})
					.then(async (response) => {
						if (response && response.status && response.status === 200) {
							dispatch(setCommunityId(community._id));
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
									communityId: community._id,
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

							if (userRole === "user") {
								dispatch(setLoading("Loading all feeds ..."));
								let payload = {
									communityId: community._id,
									count: count,
									page: 1,
									appId,
									token,
								};
								dispatch(hasMoreFeed(false));
								getAllFeed(payload).then((res) => {
									dispatch(setFeeds(res.list));
									dispatch(
										setFeedIdList(res.list.map((community) => community._id))
									);
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
			setMyFeedActive(true);
		}
	};

	function goToFeed() {
		if (isMobile) {
			setTabIndex(0);
			setHideSidebar(true);
		}
	}

	function goToChat() {
		if (isMobile) {
			setTabIndex(1);
			setHideSidebar(true);
		}
	}

	return (
		<>
			<div
				className="community-info-block"
				onClick={() => setCommunity(community)}
				style={{
					background:
						currentCommunity?.data._id === community?._id ? "#ebf7ed" : "",
				}}
			>
				<div className="info-left">
					<div
						className="community-name"
						style={{
							color:
								currentCommunity?.data._id === community?._id
									? "#007b3b"
									: "#535253",
						}}
					>
						{community.name}
					</div>
					<div className="posts-messages-wrapper">
						<span className="community-posts" onClick={() => goToFeed()}>
							<PostIcon />
							{community.totalCommunityPosts ? (
								<span className="posts-count">
									{community.totalCommunityPosts > 9
										? community.totalCommunityPosts
										: `0${community.totalCommunityPosts}`}
								</span>
							) : null}
						</span>

						<span className="community-messages" onClick={() => goToChat()}>
							<MessageIcon />
							{community?.totalUnreadMessages ? (
								<span className="posts-messages">
									{community.totalUnreadMessages}
								</span>
							) : null}
						</span>
					</div>
				</div>

				<div className="info-right">
					<div className="members-wrapper">
						{community?.communityUsers?.slice(0, 3).map((member) => {
							return (
								<Avatar
									alt="user"
									key={member?._id}
									fullName={member?.firstName + " " + member?.lastName}
									initialsFontSize="0.5rem"
									size="18px"
									src={member?.profilePic}
								/>
							);
						})}
						{community?.communityUserCounts ? (
							<span className="total-members">
								{community?.communityUserCounts > 9
									? community.communityUserCounts
									: `0${community.communityUserCounts}`}
							</span>
						) : null}
					</div>

					<div className="community-info-wrapper">
						{community.isCreator ? <CommunityAdminIcon /> : null}

						{community.isFavourite ? <FavouriteIcon /> : null}

						{community.isPublic ? <PublicIcon /> : null}
					</div>
				</div>
			</div>
		</>
	);
};

export default CommunityBlock;
