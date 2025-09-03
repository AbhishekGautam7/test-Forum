import React from "react";
import CommunityHeader from "../components/CommunityHeader";
import CommunityRightCol from "../components/CommunityRightCol";
import CreateCommunity from "../components/CreateCommunity";
import CreateBox from "../components/CreatePost";
import EditCommunity from "../components/EditCommunity";
import PostList from "../components/PostList";
import MessageBox from "../components/modules/MessageBox";

import { useDispatch, useSelector } from "react-redux";
import CommunitiesPage from "./CommunitiesPage";

import CommunityLeftCol from "../components/communityLeftCol";

/* search box redux */
import OrgAdminRight from "../components/orgAdmin/OrgAdminRight";
import { setModal, setSearchBoxStatus } from "../redux";

function Home() {
	const info = useSelector((state) => state.info);
	const messageBox = useSelector((state) => state.messageBox);

	const communityId = useSelector((state) => state.info.communityId);
	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);
	const currentCommunity = useSelector((state) => state.currentCommunity.data);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);

	let { isModal, isCreateCommunity, isEditCommunity } = info;
	const dispatch = useDispatch();

	/*
 link.href = process.env.REACT_APP_SITE_URL + "app.css"; (
 link.href = "http://localhost:3000/assets/css/app.css"; )
*/
	const hidePop = () => {
		dispatch(setSearchBoxStatus(false));
	};

	return (
		<>
			<div className="main-wrapper" part="main-wrapper">
				<div className="row equal-height-row">
					{/* <LeftCol /> */}

					<CommunityLeftCol />

					<div
						className="col-xs-12 col-lg-12 col-xl-6 community-middle-content"
						onClick={() => hidePop()}
					>
						<div className="bg-middle-content">
							{info.page === "eachcommunity" &&
							communityId &&
							currentCommunity &&
							currentCommunity._id &&
							!currentCommunity?.isDefaultCommunity ? (
								<CommunityHeader id={communityId} />
							) : (
								""
							)}
							{communityHeaderTab === "conversations" &&
								(info.page === "eachcommunity" || info.page === "home") && (
									<CreateBox />
								)}
							{(info.page === "eachcommunity" || info.page === "home") && (
								<PostList />
							)}

							{info.page === "suggestedCommunities" ||
							info.page === "myCommunities" ||
							info.page === "favoriteCommunities" ? (
								<CommunitiesPage />
							) : null}
						</div>
					</div>
					{messageBox.status && <MessageBox />}
					{/* <Rightcol /> */}
					{communityId && communityUsers && info.page === "eachcommunity" && (
						<CommunityRightCol
							communityId={communityId}
							communityMember={communityUsers}
						/>
					)}
					{info.page === "home" && <OrgAdminRight />}

					{isEditCommunity && <EditCommunity />}
					{isCreateCommunity && <CreateCommunity />}
				</div>
			</div>
			{isModal === true ? (
				<div
					className="homebox modal-backdrop fade show"
					onClick={() => dispatch(setModal(false))}
				></div>
			) : (
				""
			)}
		</>
	);
}

export default React.memo(Home);
