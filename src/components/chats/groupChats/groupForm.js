import React from "react";
import UpdateGroup from "./updateGroup";
import CreateGroup from "./createGroup";

import { useGetGroupChatSettings } from "../hooks";

const GroupForm = ({
  setIsGroupDetailBoxOpen,
  setIsCreateGroupFormOpen,
  groupInfo,
  setGroupInfo,
  setIsGroupSettingBoxOpen,
  communityUsers,
  socket,
  chatSetting,
}) => {
  const { groupChatSettings, isSuccess, isLoading, isError } =
    useGetGroupChatSettings(groupInfo?.id);

  console.log({ groupChatSettings });

  return (
    <>
      {groupInfo ? (
        <UpdateGroup
          setIsCreateGroupFormOpen={setIsCreateGroupFormOpen}
          setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
          groupInfo={groupInfo}
          setGroupInfo={setGroupInfo}
          setIsGroupSettingBoxOpen={setIsGroupSettingBoxOpen}
          chatSetting={chatSetting}
          communityUsers={communityUsers}
          groupChatSettings={groupChatSettings}
          isLoading={isLoading}
        />
      ) : (
        <CreateGroup
          socket={socket}
          setIsCreateGroupFormOpen={setIsCreateGroupFormOpen}
          communityUsers={communityUsers}
          setIsGroupDetailBoxOpen={setIsGroupDetailBoxOpen}
          groupInfo={groupInfo}
          setGroupInfo={setGroupInfo}
        />
      )}
    </>
  );
};

export default GroupForm;
