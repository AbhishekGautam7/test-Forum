import * as Tabs from "@radix-ui/react-tabs";
import CommunityRightCol from "../CommunityRightCol";
import ConfirmBox from "../modules/ConfirmBox";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmMessageTxt } from "../../redux/index";
import useChatStore from "../../stores/chatStore";
import { setSearchBoxStatus } from "../../redux";
import PublicCommunity from ".././PublicCommunity";



function OrgAdminRightCol() {
  const [tabIndex, setTabIndex] = useState(0);

  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const role = useSelector((state) => state.myProfile.data.role);

  const {
    setIsCreateGroupFormOpen,
    setIsGroupDetailBoxOpen,
    setIsGroupSettingBoxOpen,
    setIsAddOrRemoveGroupMembersBoxOpen,
    confirmBoxStatus,
    setConfirmBoxStatus,
    confirmFunction,
    setConfirmFunction,
  } = useChatStore((store) => store);

  const resetAllState = () => {
    setIsCreateGroupFormOpen(false);
    setIsGroupDetailBoxOpen(false);
    setIsGroupSettingBoxOpen(false);
    setIsAddOrRemoveGroupMembersBoxOpen(false);
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
    resetAllState();
  };

  const dispatch = useDispatch();

  const hidePop = () => {
    dispatch(setSearchBoxStatus(false));
  };

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

  const getTabStyle = (selectedIndex, index) => ({
    flex: 1,
    color: "#386cbb",
    background: selectedIndex === index ? "#e7e7e7" : "#fff",
    fontWeight: selectedIndex === index ? "700" : "500",
    padding: "12px",
    borderBottom:
      selectedIndex === index ? "3px solid #386cbb" : "3px solid #ffffff",
  });

  const TabsContent = ({ selectedIndex, focusedIndex }) => (
    <>
      <TabList>
        <Tab style={getTabStyle(selectedIndex, 0)}>Chats</Tab>
        <Tab style={getTabStyle(selectedIndex, 1)}>All Communities</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CommunityRightCol />
        </TabPanel>
        <TabPanel>
          <PublicCommunity />
        </TabPanel>
      </TabPanels>
    </>
  );

  const renderTabs = () => {
    const tabsProps = {
      style: {
        marginTop: "20px",
        position: "sticky",
        height: "auto",
        top: "35px",
      },
      index: tabIndex,
      onChange: handleTabsChange,
    };

    if (currentCommunity?.isDefaultCommunity) {
      if (role === "admin") {
        return <Tabs {...tabsProps}>{TabsContent}</Tabs>;
      } else if (currentCommunity?.chatSetting?.isChatEnabled) {
        return <Tabs {...tabsProps}>{TabsContent}</Tabs>;
      } else {
        return <PublicCommunity />;
      }
    } else {
      return <PublicCommunity />;
    }
  };

  return (
    <div
      className="col-xs-12 col-lg-12 col-xl-3 lightBg"
      onClick={() => hidePop()}
    >
      {renderTabs()}
      {confirmBoxStatus ? (
        <ConfirmBox onYes={confirm} onNo={hideConfirmBox} />
      ) : (
        ""
      )}
    </div>
  );
}

export default React.memo(OrgAdminRightCol);