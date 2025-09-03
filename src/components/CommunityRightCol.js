import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { HiMiniSpeakerWave } from "react-icons/hi2";
import { IoMdChatboxes } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";

import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { GroupChats, GroupDetail, GroupSetting, Notices } from "./chats";

import { GroupForm } from "./chats/groupChats";
import AddOrRemoveGroupUsers from "./chats/groupChats/addOrRemoveGroupUsers";

import Settings from "./settings/settings";
import {
  useGetDefaultCommunity,
  useIsMobileView,
  useGetCommunityListForChat,
} from "../hooks";
import useChatStore from "../stores/chatStore";
import ChatPlaceholder from "./ChatPlaceholder";
import ErrorBoundary from "./ErrorBoundary";
import { useGetOverAllChatSetting } from "./chats/hooks/useGetOverAllChatSetting";
import { PrivateChats } from "./chats/index";
import ChatDisabled from "./chats/modules/chatDisabled";
import PrivateChatDetail from "./chats/privateChats/privateChatDetail";
import BlockedUsers from "./settings/blockedUsers";
import UnReadMessageCount from "./unReadMessageCount";

import NotificationSettings from "./settings/notificationSettings";
import { setConfirmMessageTxt } from "../redux/confirmbox/Actions";
import ConfirmBox from "./modules/ConfirmBox";
import SearchableDropdown from "./SearchableDropdown";

import { setCurrentCommunity } from "../redux/current_community/Actions";
import { getCommunityDetail, getUsersDetail } from "../api/community";
import { setCommunityId } from "../redux/info/Actions";

export const SITE_URL = process.env.REACT_APP_SITE_URL;

const CommunityRightCol = () => {
  const [groupInfo, setGroupInfo] = useState(null);
  const [communityGroupList, setCommunityGroupList] = useState(null);
  const [privateChats, setPrivateChats] = useState(null);
  const [privateChatInfo, setPrivateChatInfo] = useState({
    isPrivateChatOpen: false,
    info: null,
  });

  const [activeTab, setActiveTab] = useState("chats");

  const role = useSelector((state) => state.myProfile.data.role);

  const [value, setValue] = useState("");

  // const { communityList, isLoading: isCommunityListLoading } = useGetCommunityListForChat();

  const { defaultCommunity } = useGetDefaultCommunity();

  const {
    isCreateGroupFormOpen,
    setIsCreateGroupFormOpen,
    isGroupDetailBoxOpen,
    setIsGroupDetailBoxOpen,
    isGroupSettingBoxOpen,
    setIsGroupSettingBoxOpen,
    isAddOrRemoveGroupMembersBoxOpen,
    setIsAddOrRemoveGroupMembersBoxOpen,
    setUnSeenMessageCount,
    unseenMessageCount,
    showBlockedAndUnBlockedUsersList,
    setShowBlockedAndUnBlockedUsersList,
    showNotificationSettings,
    confirmBoxStatus,
    setConfirmBoxStatus,
    confirmFunction,
    setConfirmFunction,
    hasClickedOnInputBox,
  } = useChatStore((store) => store);

  const currentCommunity = useSelector((state) => state.currentCommunity.data);


const { overAllChatSettings: chatSetting, isSuccess, isLoading, isError } =
  useGetOverAllChatSetting();


  const socket = useSelector((state) => state.socket.socket);

  const { isMobileView } = useIsMobileView({});

  const joinGroupChatRooms = useCallback(
    ({ communityId }) => {
      socket.emit("joinGroupChatRooms", { communityId }, (res) => {
        console.log("joined", res);
      });
    },
    [socket]
  );

  const joinNoticeGroup = useCallback(
    ({ communityId }) => {
      socket.emit("enterNoticeGroup", { communityId }, (res) => {
        console.log("joined", res);
      });
    },
    [socket]
  );

  const joinPrivateChatRooms = useCallback(
    ({ communityId }) => {
      socket.emit("joinPrivateChatRooms", { communityId }, (res) => {
        console.log("joined", res);
      });
    },
    [socket]
  );

  useEffect(() => {
    if (currentCommunity) {
      setValue(
        currentCommunity?.isDefaultCommunity ? "" : currentCommunity?.name
      );
      setUnSeenMessageCount({
        ...currentCommunity?.unseenMessageCount,
      });
    }
  }, [currentCommunity, setUnSeenMessageCount]);

  useEffect(() => {
    if (socket) {
      socket.emit(
        "enterCommunity",
        {
          communityId: currentCommunity?._id,
        },
        (res) => console.log("enterCommunity", res)
      );
    }

    return () => {
      if (socket) {
        socket.off("enterCommunity");
        socket.emit(
          "exitCommunity",
          {
            communityId: currentCommunity?._id,
          },
          (res) => console.log("exitCommunity", res)
        );
      }
    };
  }, [currentCommunity?._id, socket]);

  useEffect(() => {
    if (chatSetting) {
      if (chatSetting?.isChatEnabled === false) {
        setActiveTab("settings");
      } else {
        if (chatSetting?.privateChat?.isEnabled) {
          setActiveTab("chats");
          joinPrivateChatRooms({ communityId: currentCommunity?._id });
        } else if (
          !chatSetting?.privateChat?.isEnabled &&
          chatSetting?.groupChat?.isEnabled
        ) {
          setActiveTab("groups");
          joinGroupChatRooms({ communityId: currentCommunity?._id });
        } else if (
          !chatSetting?.privateChat?.isEnabled &&
          !chatSetting?.groupChat?.isEnabled &&
          chatSetting?.notice?.isEnabled
        ) {
          setActiveTab("notices");
          joinNoticeGroup({ communityId: currentCommunity?._id });
        } else {
          setActiveTab("settings");
        }
      }
    }
  }, [
    chatSetting,
    chatSetting?.isChatEnabled,
    currentCommunity?._id,
    joinGroupChatRooms,
    joinNoticeGroup,
    joinPrivateChatRooms,
  ]);

  const resetAllState = () => {
    setIsCreateGroupFormOpen(false);
    setIsGroupDetailBoxOpen(false);
    setIsGroupSettingBoxOpen(false);
    setIsAddOrRemoveGroupMembersBoxOpen(false);
    setShowBlockedAndUnBlockedUsersList(false);
    setGroupInfo(null);
  };

  const leaveNoticeGroup = ({ communityId }) => {
    socket.emit("exitNoticeGroup", { communityId });
  };

  const leaveGroupChatRooms = ({ communityId }) => {
    socket.emit("leaveGroupChatRooms", { communityId });
  };

  const bgUrl =
    "https://i.pinimg.com/564x/62/40/b6/6240b66d5c50c8661eee78b439a7d33c.jpg";

  const showPrivateChatDetail = privateChatInfo?.isPrivateChatOpen;

  const showGroupDetail = isGroupDetailBoxOpen && !isGroupSettingBoxOpen;

  const showGroupSetting = isGroupSettingBoxOpen && !isGroupDetailBoxOpen;

  const showAddorRemoveGroupUsersForm =
    isAddOrRemoveGroupMembersBoxOpen && !isGroupSettingBoxOpen;

  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);

  const showTab =
    !isGroupDetailBoxOpen &&
    !isGroupSettingBoxOpen &&
    !isAddOrRemoveGroupMembersBoxOpen &&
    !privateChatInfo?.isPrivateChatOpen &&
    !showBlockedAndUnBlockedUsersList &&
    !showNotificationSettings;

  const showChat = chatSetting?.isChatEnabled;

  const showPrivateChat = chatSetting?.privateChat?.isEnabled;

  const showGroupChat = chatSetting?.groupChat?.isEnabled;

  const showNotice = chatSetting?.notice?.isEnabled;

  const showSetting = chatSetting?.isChatEnabled || role === "admin";

  const dispatch = useDispatch();

  const hideConfirmBox = () => {
    try {
      dispatch(setConfirmMessageTxt(""));
      setConfirmBoxStatus(false);
    } catch (error) {
      console.error(error);
    }
  };

  const confirm = () => {
    confirmFunction();
    setConfirmFunction(null);
  };

  const handleSelectValue = (val) => {
    setValue(val.label);
    getCommunityDetail({
      communityId: val.value,
      appId,
      token,
    }).then(async (response) => {
      if (response && response.status && response.status === 200) {
        dispatch(setCommunityId(val.value));
        const communityUsersWithDetail = await getUsersDetail({
          token,
          userIds: response.data.data.communityUsers,
        }).then((res) => res.data.data);

        dispatch(
          setCurrentCommunity({
            ...response.data.data,
            communityUsers: communityUsersWithDetail,
            doesDefaultCommunityExist: !!defaultCommunity,
          })
        );
      }
    });
  };

  console.log({ currentCommunity });

  return (
    <>
      <div
        className={`${
          currentCommunity?.isDefaultCommunity
            ? ""
            : "col-xs-12 col-lg-12 col-xl-3"
        } community-chat`}
        style={{
          backgroundImage: `url(${bgUrl})`,
          position: isMobileView ? "static" : "sticky",
          top: "35px",
          height: isMobileView
            ? hasClickedOnInputBox
              ? "calc(100vh + 400px)"
              : "calc(100vh - 56px)"
            : "calc(100vh - 50px)",
          backgroundRepeat: "repeat-y",
          // width: "100%",
        }}
      >
        <ErrorBoundary>
          {isLoading ? (
            <ChatPlaceholder />
          ) : (
            <div className=" community-right-sidebar">
              {showBlockedAndUnBlockedUsersList && <BlockedUsers />}

              {showNotificationSettings && (
                <NotificationSettings
                  showNotice={showNotice}
                  showGroupChat={showGroupChat}
                  showPrivateChat={showPrivateChat}
                />
              )}

              {showPrivateChatDetail && (
                <PrivateChatDetail
                  socket={socket}
                  setPrivateChatInfo={setPrivateChatInfo}
                  privateChatInfo={privateChatInfo}
                  chatSetting={chatSetting}
                  activeTab={activeTab}
                  privateChats={privateChats}
                  setPrivateChats={setPrivateChats}
                />
              )}

              {showGroupDetail && (
                <GroupDetail
                  setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
                  setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
                  groupInfo={groupInfo}
                  setGroupInfo={setGroupInfo}
                  socket={socket}
                  chatSetting={chatSetting}
                  activeTab={activeTab}
                  setCommunityGroupList={setCommunityGroupList}
                  communityGroupList={communityGroupList}
                />
              )}
              {showGroupSetting && (
                <GroupSetting
                  setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
                  setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
                  groupInfo={groupInfo}
                  setGroupInfo={setGroupInfo}
                  socket={socket}
                  setIsCreateGroupFormOpen={setIsCreateGroupFormOpen}
                  setIsAddOrRemoveGroupMembersBoxOpen={
                    setIsAddOrRemoveGroupMembersBoxOpen
                  }
                  isAddOrRemoveGroupMembersBoxOpen={
                    isAddOrRemoveGroupMembersBoxOpen
                  }
                />
              )}
              {showAddorRemoveGroupUsersForm && (
                <AddOrRemoveGroupUsers
                  groupInfo={groupInfo}
                  setIsAddOrRemoveGroupMembersBoxOpen={
                    setIsAddOrRemoveGroupMembersBoxOpen
                  }
                  setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
                  isAddOrRemoveGroupMembersBoxOpen={
                    isAddOrRemoveGroupMembersBoxOpen
                  }
                />
              )}
              {showTab ? (
                <div>
                  {isMobileView &&
                    defaultCommunity &&
                    !defaultCommunity?.chatSetting?.isChatEnabled && (
                      <div
                        style={{
                          width: "100%",
                          marginBottom: "5px",
                        }}
                      >
                        <SearchableDropdown
                          options={communityList ? communityList : []}
                          label="name"
                          id="id"
                          selectedVal={value}
                          handleChange={handleSelectValue}
                          setSelectedValue={setValue}
                        />
                      </div>
                    )}
                  <Nav tabs fill className="border-0 tab-container">
                    {showChat && (
                      <>
                        {showPrivateChat && (
                          <NavItem>
                            <NavLink
                              className={`community-chat-tab-item position-relative  ${
                                activeTab === "chats" ? "tab-item-active" : ""
                              }`}
                              onClick={() => {
                                resetAllState();
                                setActiveTab("chats");
                                joinPrivateChatRooms({
                                  communityId: currentCommunity?._id,
                                });
                                leaveNoticeGroup({
                                  communityId: currentCommunity?._id,
                                });
                              }}
                            >
                              {unseenMessageCount?.unseenPrivateMessageCount >
                                0 && (
                                <UnReadMessageCount
                                  count={
                                    unseenMessageCount?.unseenPrivateMessageCount
                                  }
                                />
                              )}

                              <IoMdChatboxes size={22} />
                              <span>Chats</span>
                            </NavLink>
                          </NavItem>
                        )}
                        {showGroupChat && (
                          <NavItem>
                            <NavLink
                              className={`community-chat-tab-item position-relative  ${
                                activeTab === "groups" ? "tab-item-active" : ""
                              }`}
                              onClick={() => {
                                resetAllState();
                                setActiveTab("groups");
                                joinGroupChatRooms({
                                  communityId: currentCommunity?._id,
                                });
                                leaveNoticeGroup({
                                  communityId: currentCommunity?._id,
                                });
                              }}
                            >
                              {unseenMessageCount?.unseenGroupMessageCount >
                                0 && (
                                <UnReadMessageCount
                                  count={
                                    unseenMessageCount?.unseenGroupMessageCount
                                  }
                                />
                              )}

                              <MdGroups size={22} />
                              <span>Groups</span>
                            </NavLink>
                          </NavItem>
                        )}

                        {showNotice && (
                          <NavItem>
                            <NavLink
                              className={`community-chat-tab-item position-relative ${
                                activeTab === "notices" ? "tab-item-active" : ""
                              }`}
                              onClick={() => {
                                resetAllState();
                                setActiveTab("notices");
                                joinNoticeGroup({
                                  communityId: currentCommunity?._id,
                                });
                              }}
                            >
                              {unseenMessageCount?.unseenNoticeCount > 0 && (
                                <UnReadMessageCount
                                  count={unseenMessageCount?.unseenNoticeCount}
                                />
                              )}

                              <HiMiniSpeakerWave size={22} />
                              <span>Notices</span>
                            </NavLink>
                          </NavItem>
                        )}
                      </>
                    )}

                    {showSetting ? (
                      <NavItem>
                        <NavLink
                          className={`community-chat-tab-item  ${
                            activeTab === "settings" ? "tab-item-active" : ""
                          }`}
                          onClick={() => {
                            resetAllState();
                            setActiveTab("settings");
                            leaveNoticeGroup({
                              communityId: currentCommunity?._id,
                            });
                          }}
                        >
                          <IoSettingsSharp size={22} />
                          <span>Settings</span>
                        </NavLink>
                      </NavItem>
                    ) : (
                      <ChatDisabled />
                    )}
                  </Nav>

                  <TabContent activeTab={activeTab}>
                    {showPrivateChat && (
                      <TabPane tabId="chats">
                        {!privateChatInfo?.isPrivateChatOpen && (
                          <PrivateChats
                            socket={socket}
                            chatSetting={chatSetting}
                            setPrivateChatInfo={setPrivateChatInfo}
                            activeTab={activeTab}
                            privateChats={privateChats}
                            setPrivateChats={setPrivateChats}
                            unseenMessageCount={unseenMessageCount}
                          />
                        )}
                      </TabPane>
                    )}

                    {showGroupChat && (
                      <TabPane tabId="groups">
                        {isCreateGroupFormOpen ? (
                          <GroupForm
                            chatSetting={chatSetting}
                            setIsCreateGroupFormOpen={setIsCreateGroupFormOpen}
                            setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
                            groupInfo={groupInfo}
                            setGroupInfo={setGroupInfo}
                            setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
                            communityUsers={currentCommunity?.communityUsers}
                            socket={socket}
                          />
                        ) : (
                          <GroupChats
                            setIsCreateGroupFormOpen={setIsCreateGroupFormOpen}
                            setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
                            groupInfo={groupInfo}
                            setGroupInfo={setGroupInfo}
                            socket={socket}
                            activeTab={activeTab}
                            chatSetting={chatSetting}
                            communityGroupList={communityGroupList}
                            setCommunityGroupList={setCommunityGroupList}
                            unseenMessageCount={unseenMessageCount}
                          />
                        )}
                      </TabPane>
                    )}

                    {showNotice && (
                      <TabPane tabId="notices">
                        <Notices
                          defaultGroup={currentCommunity?.defaultGroup}
                          communityId={currentCommunity?._id}
                          socket={socket}
                          role={role}
                          chatSetting={chatSetting}
                          activeTab={activeTab}
                        />
                      </TabPane>
                    )}

                    {showSetting ? (
                      <TabPane tabId="settings">
                        <Settings
                          role={role}
                          showNotice={showNotice}
                          showGroupChat={showGroupChat}
                          showPrivateChat={showPrivateChat}
                          isCommunityAdmin={currentCommunity?.isCommunityAdmin}
                        />
                      </TabPane>
                    ) : null}
                  </TabContent>
                </div>
              ) : null}
            </div>
          )}
        </ErrorBoundary>
      </div>

      {confirmBoxStatus ? (
        <ConfirmBox onYes={confirm} onNo={hideConfirmBox} />
      ) : (
        ""
      )}
    </>
  );
};

export default React.memo(CommunityRightCol);
