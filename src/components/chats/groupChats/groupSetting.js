import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
	setConfirmMessageTxt,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	setModal,
} from "../../../redux";

import useChatStore from "../../../stores/chatStore";
import { useLeaveGroup } from "../hooks/useLeaveGroup";

const GroupSetting = ({
	setIsGroupDetailBoxOpen,
	setIsGroupSettingBoxOpen,
	setIsCreateGroupFormOpen,
	setIsAddOrRemoveGroupMembersBoxOpen,
	groupInfo,
	socket,
}) => {
	const dispatch = useDispatch();

	const userRole = useSelector((state) => state.myProfile.data.role);

	const { setConfirmBoxStatus, setConfirmFunction } = useChatStore(
		(store) => store
	);

	const { mutate } = useLeaveGroup({
		groupId: groupInfo?.id,
	});

	const confirmLeaveGroup = () => {
		try {
			dispatch(setModal(true));
			dispatch(
				setConfirmMessageTxt("Are you sure you want to leave this community ? ")
			);
			setConfirmBoxStatus(true);
			setConfirmFunction(confirmLeave);
		} catch (error) {
			console.error(error);
		}
	};

	const leaveGroup = ({ groupId }) => {
		socket.emit("exitGroup", { groupId, hasLeftGroup: true });
	};

	const confirmLeave = () => {
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Leaving group ... "));
		dispatch(setMessageBoxCloseBtn(false));
		mutate();
		dispatch(setMessageTxt("Successfully left group"));
		dispatch(setMessageBoxCloseBtn(true));
		leaveGroup({ groupId: groupInfo?.id });
		setIsGroupSettingBoxOpen(false);
		setIsGroupDetailBoxOpen(false);
	};
	return (
		<div className="group-setting-container">
			<button
				className="back-btn"
				onClick={() => {
					setIsGroupSettingBoxOpen(false);
					setIsGroupDetailBoxOpen(true);
				}}
			>
				<IoIosArrowBack />
				<span className="back-text">Back</span>
			</button>
			<div className="w-100 gap-3 d-flex flex-column align-items-center justify-content-center">
				<strong className="group-title">{groupInfo?.name}</strong>
				<p className="member-count">{groupInfo?.users?.length} Members</p>
			</div>
			<div className="d-flex flex-column gap-3 mt-2">
				{groupInfo && groupInfo?.overAllSetting?.canEditSetting && (
					<div className="group-setting-header">
						<span>Group Setting</span>
					</div>
				)}
				{groupInfo && groupInfo?.overAllSetting?.canEditSetting && (
					<div
						className="group-setting-item-container"
						onClick={() => {
							setIsCreateGroupFormOpen(true);
							setIsGroupSettingBoxOpen(false);
						}}
					>
						<div className="d-flex flex-column group-setting-item">
							<strong>Edit Group</strong>
							<small>Make changes to this group</small>
						</div>
						<IoIosArrowForward size={30} color="#5D5C5D" />
					</div>
				)}
				<div
					className="group-setting-item-container"
					onClick={() => {
						setIsGroupSettingBoxOpen(false);
						setIsAddOrRemoveGroupMembersBoxOpen(true);
					}}
				>
					<div className="d-flex flex-column group-setting-item">
						<strong>Members</strong>
						<small>View the list of the members in this group</small>
					</div>
					<IoIosArrowForward size={30} color="#5D5C5D" />
				</div>
				{/* <div className="group-setting-item-container">
					<div className="d-flex flex-column group-setting-item">
						<strong>Mute Group</strong>
						<small>
							Enabling this will mute chats and mentions from this user
						</small>
					</div>
					<Switch checkedIcon={false} uncheckedIcon={false} />
				</div> */}
				{/* <div className="group-setting-item-container">
					<div className="d-flex flex-column group-setting-item">
						<strong>Media And Files</strong>
						<small>View the list of media and files shared in this chat.</small>
					</div>
					<IoIosArrowForward size={30} color="#5D5C5D" />
				</div> */}
				{/* <div className="group-setting-item-container">
					<div className="d-flex flex-column group-setting-item">
						<strong>Report</strong>
						<small>
							Found some unusual activity? Report it to get action taken
						</small>
					</div>
					<IoIosArrowForward size={30} color="#5D5C5D" />
				</div> */}
				{userRole !== "admin" && (
					<div
						style={{
							background: "#FFEFEF",
						}}
						className="group-setting-item-container"
						onClick={confirmLeaveGroup}
					>
						<div className="d-flex flex-column group-setting-item">
							<strong
								style={{
									color: "#C03B4F",
								}}
							>
								Leave Group
							</strong>
							<small
								style={{
									color: "#C03B4F",
								}}
							>
								This action is non reversible and required to prompt
								confirmation
							</small>
						</div>
						<LuLogOut size={30} color="#C03B4F" />
					</div>
				)}
			</div>
		</div>
	);
};

export default GroupSetting;
