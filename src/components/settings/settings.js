import * as Tabs from "@radix-ui/react-tabs";

import AdminSettings from "./adminSettings";
import CommunityAdminSettings from "./communityAdminSettings";
import { useGetChatSettings } from "./hooks";
import PersonalSettings from "./personalSettings";

const Settings = ({
  role,
  isCommunityAdmin,
  showNotice,
  showGroupChat,
  showPrivateChat,
}) => {
  const { isLoading, chatSettingsData } = useGetChatSettings();

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: "10px",
    textAlign: "center",
    color: "#386cbb",
    background: "#fff",
    border: "none",
    borderBottom: isActive ? "3px solid #386cbb" : "3px solid #ffffff",
    cursor: "pointer",
  });

  const renderSettingContent = () => {
    if (role === "admin") {
      return (
        <Tabs.Root defaultValue="admin">
          <Tabs.List style={{ display: "flex" }}>
            <Tabs.Trigger value="admin" style={tabStyle(false)}>
              Admin
            </Tabs.Trigger>
            <Tabs.Trigger value="community" style={tabStyle(false)}>
              Community
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="admin">
            <AdminSettings orgAdminSetting={chatSettingsData?.orgAdminSetting} />
          </Tabs.Content>

          <Tabs.Content value="community">
            {chatSettingsData?.orgAdminSetting?.isChatEnabled && (
              <CommunityAdminSettings
                orgAdminSetting={chatSettingsData?.orgAdminSetting}
                communityAdminSetting={chatSettingsData?.communityAdminSetting}
              />
            )}
          </Tabs.Content>
        </Tabs.Root>
      );
    }

    if (role === "user") {
      if (isCommunityAdmin) {
        return (
          <Tabs.Root defaultValue="community">
            <Tabs.List style={{ display: "flex" }}>
              <Tabs.Trigger value="community" style={tabStyle(false)}>
                Community
              </Tabs.Trigger>
              <Tabs.Trigger value="personal" style={tabStyle(false)}>
                Personal
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="community">
              {chatSettingsData?.orgAdminSetting?.isChatEnabled && (
                <CommunityAdminSettings
                  orgAdminSetting={chatSettingsData?.orgAdminSetting}
                  communityAdminSetting={chatSettingsData?.communityAdminSetting}
                />
              )}
            </Tabs.Content>

            <Tabs.Content value="personal">
              {chatSettingsData?.orgAdminSetting?.isChatEnabled && (
                <PersonalSettings
                  chatSettingsData={chatSettingsData}
                  showNotice={showNotice}
                  showGroupChat={showGroupChat}
                  showPrivateChat={showPrivateChat}
                />
              )}
            </Tabs.Content>
          </Tabs.Root>
        );
      }

      return (
        <>
          {chatSettingsData?.orgAdminSetting?.isChatEnabled && (
            <PersonalSettings
              showNotice={showNotice}
              showGroupChat={showGroupChat}
              showPrivateChat={showPrivateChat}
            />
          )}
        </>
      );
    }

    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div className="white-bg settings-container">{renderSettingContent()}</div>;
};

export default Settings;
