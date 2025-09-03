import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommunitiesPage from "../components/Communities";
import CommunityHeader from "../components/CommunityHeader";
import CommunityRightCol from "../components/CommunityRightCol";
import CreateCommunity from "../components/CreateCommunity";
import CreatePost from "../components/CreatePost";
import EditCommunity from "../components/EditCommunity";
import MessageBox from "../components/modules/MessageBox";
import AdminPostList from "../components/orgAdmin/AdminPostLIst";
import OrgAdminRight from "../components/orgAdmin/OrgAdminRight";
import SearchPage from "../components/search";

import { setSearchBoxStatus } from "../redux";

import CommunityLeftCol from "../components/communityLeftCol";

function OrgAdmin() {
	const info = useSelector((state) => state.info);
	const messageBox = useSelector((state) => state.messageBox);
	const communityHeaderTab = useSelector(
		(state) => state.info.communityHeaderTab
	);
	const communityId = useSelector((state) => state.info.communityId);
	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);
	const myCommunity = useSelector((state) => state.myCommunity.data);
	const currentCommunity = useSelector((state) => state.currentCommunity.data);
	const dispatch = useDispatch();
	let { isModal, isCreateCommunity, isEditCommunity } = info;
	const inputEl = useRef(null);
	const hidePop = () => {
		dispatch(setSearchBoxStatus(false));
	};

	return (
		<>
			<div className="main-wrapper" part="main-wrapper" ref={inputEl}>
				<div className="row equal-height-row">
					{/* <OrgAdminLeft /> */}

					<CommunityLeftCol />
					{(info.page === "eachcommunity" || info.page === "home") && (
						<>
							<div
								className="col-xs-12 col-lg-12 col-xl-6 community-middle-content"
								onClick={() => hidePop()}
							>
								{communityId &&
								currentCommunity &&
								currentCommunity._id &&
								!currentCommunity?.isDefaultCommunity ? (
									<CommunityHeader id={communityId} />
								) : (
									""
								)}
								{communityHeaderTab === "conversations" && <CreatePost />}
								<AdminPostList myCommunity={myCommunity} />
							</div>
							{communityId &&
							communityUsers &&
							!currentCommunity?.isDefaultCommunity ? (
								<CommunityRightCol
									communityId={communityId}
									communityMember={communityUsers}
								/>
							) : (
								<OrgAdminRight />
							)}
						</>
					)}
					{info.page === "search" && (
						<div
							className="col-xs-12 col-lg-12 col-xl-9 searchPage  "
							onClick={() => hidePop()}
						>
							<SearchPage />
						</div>
					)}
					{(info.page === "allCommunities" ||
						info.page === "todaysCommunities" ||
						info.page === "deletedCommunities") && (
						<div
							className="col-xs-12 col-lg-12 col-xl-9 community-middle-content"
							onClick={() => hidePop()}
						>
							<CommunitiesPage />
						</div>
					)}
					{messageBox.status && <MessageBox />}
					{/* <RightCol role="Admin" /> */}
					{isEditCommunity && <EditCommunity />}
					{isCreateCommunity && <CreateCommunity />}
				</div>
			</div>

			{isModal === true ? <div className="modal-backdrop fade show"></div> : ""}
		</>
	);
}

export default React.memo(OrgAdmin);
