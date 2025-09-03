import { IoIosArrowForward } from "react-icons/io";
import useChatStore from "../../stores/chatStore";

import { AiOutlineArrowRight, AiOutlineStop } from "react-icons/ai";
import { IoNotificationsOffSharp, IoNotificationsSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
	setConfirmMessageTxt,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	setModal,
} from "../../redux";

import {
	useGetPersonalSettings,
	useUpdatePersonalSettings,
} from "./hooks";

const PersonalSettings = ({
	chatSettingsData,
	showNotice,
	showGroupChat,
	showPrivateChat,
}) => {
	const { setShowBlockedAndUnBlockedUsersList, setShowNotificationSettings } =
		useChatStore((store) => store);

	const dispatch = useDispatch();

	const { setConfirmBoxStatus, setConfirmFunction } = useChatStore(
		(store) => store
	);

	const { personalSettingsData, isLoading } = useGetPersonalSettings();
	const { mutate } = useUpdatePersonalSettings();

	let stopAddingToGroup =
		personalSettingsData?.personalChatSetting?.stopAddingToGroup;

	let optOutGettingNotices =
		personalSettingsData?.personalChatSetting?.optOutGettingNotices;

	const openExemptFromGroupsModal = () => {
		try {
			dispatch(setModal(true));
			dispatch(
				setConfirmMessageTxt(
					stopAddingToGroup
						? "Are you sure you want to allow yourself to be added in any groups?"
						: "Are you sure you want to be exempt from being added to any groups? "
				)
			);
			setConfirmBoxStatus(true);
			setConfirmFunction(confirmExemptFromGroups);
		} catch (error) {
			console.error(error);
		}
	};

	const openTurnOffNoticesModal = () => {
		try {
			dispatch(setModal(true));
			dispatch(
				setConfirmMessageTxt(
					optOutGettingNotices
						? "Are you sure you want to turn on new notices? "
						: "Are you sure you want to turn off new notices? "
				)
			);
			setConfirmBoxStatus(true);
			setConfirmFunction(confirmTurnOffNotices);
		} catch (error) {
			console.error(error);
		}
	};

	const confirmExemptFromGroups = () => {
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		dispatch(setMessageBox(true));
		dispatch(
			setMessageTxt(
				stopAddingToGroup
					? "Allowing you to be added to groups ... "
					: "Preventing you from being added to groups ... "
			)
		);
		dispatch(setMessageBoxCloseBtn(false));
		mutate({
			stopAddingToGroup: !stopAddingToGroup,
			optOutGettingNotices: optOutGettingNotices,
		});
		dispatch(
			setMessageTxt(
				stopAddingToGroup
					? "You can be added to any groups now"
					: "You can be added to any groups until you turn the setting back on"
			)
		);
		dispatch(setMessageBoxCloseBtn(true));
	};

	const confirmTurnOffNotices = () => {
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		dispatch(setMessageBox(true));
		dispatch(
			setMessageTxt(
				optOutGettingNotices
					? "Turning on new notices... "
					: "Turning off new notices... "
			)
		);
		dispatch(setMessageBoxCloseBtn(false));
		mutate({
			optOutGettingNotices: !optOutGettingNotices,
			stopAddingToGroup: stopAddingToGroup,
		});

		dispatch(
			setMessageTxt(
				optOutGettingNotices
					? "You will receive new notices now"
					: "You wont receive new notices until you turn the setting back on"
			)
		);
		dispatch(setMessageBoxCloseBtn(true));
	};

	return (
		<div className="p-2 mt-1">
			{showGroupChat || showNotice ? (
				<div className="group-setting-header" style={{ marginBottom: "8px" }}>
					<span>Personal Settings</span>
				</div>
			) : null}

			{isLoading ? (
				<div>Loading ...</div>
			) : (
				<>
					{showGroupChat ? (
						<button
							className={`group-setting-item-container personal-buttons ${
								stopAddingToGroup
									? "personal-buttons-green"
									: "personal-buttons-red"
							}`}
							onClick={() => openExemptFromGroupsModal()}
						>
							<div className="d-flex flex-column group-setting-item ">
								<strong>
									{stopAddingToGroup ? "Allow in groups" : "Exempt from groups"}
								</strong>
								<small>
									{stopAddingToGroup
										? "Allows others to add in you groups"
										: "Prevents you from being added in any groups"}
								</small>
							</div>
							{stopAddingToGroup ? <AiOutlineArrowRight /> : <AiOutlineStop />}
						</button>
					) : null}

					{showNotice ? (
						<button
							className={`group-setting-item-container personal-buttons ${
								optOutGettingNotices
									? "personal-buttons-green"
									: "personal-buttons-red"
							}`}
							onClick={() => openTurnOffNoticesModal()}
						>
							<div className="d-flex flex-column group-setting-item">
								<strong>
									{optOutGettingNotices
										? "Turn on notices"
										: "Turn off notices"}
								</strong>
								<small>
									{optOutGettingNotices
										? "Allows you to get new notices"
										: "Prevents you from getting new notices"}
								</small>
							</div>
							{optOutGettingNotices ? (
								<IoNotificationsSharp />
							) : (
								<IoNotificationsOffSharp />
							)}
						</button>
					) : null}
				</>
			)}

			<div className="group-setting-header">
				<span>Notification Settings</span>
			</div>

			{showNotice || showGroupChat || showPrivateChat ? (
				<div
					className="group-setting-item-container"
					onClick={() => setShowNotificationSettings(true)}
				>
					<div className="d-flex flex-column group-setting-item">
						<strong>Notification settings</strong>
						<small>Control notifications from chat, groups and notices</small>
					</div>
					<div style={{ width: "20px", height: "20px" }}>
						<IoIosArrowForward size={20} color="#5D5C5D" />
					</div>
				</div>
			) : null}

			<div className="group-setting-header">
				<span>Other Settings</span>
			</div>

			<div
				className="group-setting-item-container"
				onClick={() => {
					setShowBlockedAndUnBlockedUsersList(true);
				}}
			>
				<div className="d-flex flex-column group-setting-item">
					<strong>Block Users</strong>
					<small>
						View, Add, and Remove User, that you wish to block or Unblock from
						contacting you.
					</small>
				</div>
				<div style={{ width: "20px", height: "20px" }}>
					<IoIosArrowForward size={20} color="#5D5C5D" />
				</div>
			</div>
		</div>
	);
};

export default PersonalSettings;
