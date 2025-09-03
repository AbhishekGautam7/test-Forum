import {create} from "zustand";
import { devtools } from "zustand/middleware";

const store = (set) => ({
	isMyFeedButtonClicked: true,
	hasClickedOnInputBox: false,
	setHasClickedOnInputBox: (hasClickedOnInputBox) => {
		set({ hasClickedOnInputBox });
	},
	confirmFunction: () => null,
	isCreateGroupFormOpen: false,
	confirmBoxStatus: false,
	showBlockedAndUnBlockedUsersList: false,
	unseenMessageCount: {
		total: 0,
		unseenGroupMessageCount: 0,
		unseenNoticeCount: 0,
		unseenPrivateMessageCount: 0,
	},
	showNotificationSettings: false,
	setShowNotificationSettings: (showNotificationSettings) => {
		set({ showNotificationSettings });
	},
	setIsMyFeedButtonClicked: (isMyFeedButtonClicked) => {
		set({ isMyFeedButtonClicked });
	},
	setConfirmFunction: (confirmFunction) => {
		set({ confirmFunction });
	},
	setConfirmBoxStatus: (confirmBoxStatus) => {
		set({ confirmBoxStatus });
	},
	setUnSeenMessageCount: (unseenMessageCount) => {
		set({ unseenMessageCount });
	},
	setShowBlockedAndUnBlockedUsersList: (showBlockedAndUnBlockedUsersList) => {
		set({ showBlockedAndUnBlockedUsersList });
	},
	setIsCreateGroupFormOpen: (isCreateGroupFormOpen) =>
		set({ isCreateGroupFormOpen }),
	isGroupDetailBoxOpen: false,
	setIsGroupDetailBoxOpen: (isGroupDetailBoxOpen) =>
		set({ isGroupDetailBoxOpen }),
	isGroupSettingBoxOpen: false,
	setIsGroupSettingBoxOpen: (isGroupSettingBoxOpen) =>
		set({ isGroupSettingBoxOpen }),
	isAddOrRemoveGroupMembersBoxOpen: false,
	setIsAddOrRemoveGroupMembersBoxOpen: (isAddOrRemoveGroupMembersBoxOpen) =>
		set({ isAddOrRemoveGroupMembersBoxOpen }),
});

const useChatStore = create(devtools(store));

export default useChatStore;
