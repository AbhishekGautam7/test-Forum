import * as Tabs from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CommunityLeftCol from "../components/communityLeftCol";
import TopBar from "../components/topBar";
import CommunityHeader from "../components/CommunityHeader";
import CommunityRightCol from "../components/CommunityRightCol";
import CreateCommunity from "../components/CreateCommunity";
import CreatePost from "../components/CreatePost";
import EditCommunity from "../components/EditCommunity";
import PostList from "../components/PostList";
import RightCol from "../components/RightCol";
import MessageBox from "../components/modules/MessageBox";
import AdminPostList from "../components/orgAdmin/AdminPostLIst";
import CreateBox from "../components/CreatePost";
import CommunitiesPage from "./CommunitiesPage";

import { setModal, setSearchBoxStatus } from "../redux/index";
import useChatStore from "../stores/chatStore";
import { useIsMobileView } from "../hooks/index";
import { getCommunityList } from "../api";

const MobileApp = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const [hideSidebar, setHideSidebar] = useState(true);
  const communityId = useSelector((state) => state.info.communityId);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const currentCommunity = useSelector((state) => state.currentCommunity.data);
  const messageBox = useSelector((state) => state.messageBox);
  const communityHeaderTab = useSelector((state) => state.info.communityHeaderTab);
  const info = useSelector((state) => state.info);
  const role = useSelector((state) => state.myProfile.data.role);

  const { isMobileView } = useIsMobileView({});
  const dispatch = useDispatch();

  const { 
    setIsCreateGroupFormOpen, 
    setIsGroupDetailBoxOpen, 
    setIsGroupSettingBoxOpen, 
    setIsAddOrRemoveGroupMembersBoxOpen, 
    isMyFeedButtonClicked 
  } = useChatStore((store) => store);

  const [myCommunity, setMyCommunity] = useState(null);

  const queryMyCommunity = async () => {
    try {
      const result = await getCommunityList({ appId, token });
      setMyCommunity(result?.data?.data?.communities);
    } catch (error) {
      console.error(error);
    }
  };

  const resetAllState = () => {
    setIsCreateGroupFormOpen(false);
    setIsGroupDetailBoxOpen(false);
    setIsGroupSettingBoxOpen(false);
    setIsAddOrRemoveGroupMembersBoxOpen(false);
  };

  const hidePop = () => {
    dispatch(setSearchBoxStatus(false));
  };

  const handleTabsChange = (index) => {
    setTabIndex(index);
    resetAllState();
  };

  const getTabStyle = (index) => ({
    flex: 1,
    color: "#386cbb",
    background: tabIndex === index ? "#e7e7e7" : "#fff",
    fontWeight: tabIndex === index ? "700" : "500",
    padding: isMobileView ? "6px" : "12px",
    fontSize: isMobileView ? "12px" : "",
    borderBottom: tabIndex === index ? "3px solid #386cbb" : "3px solid #fff",
  });

  const displayChatTab = () => {
    if (isMyFeedButtonClicked) {
      if (currentCommunity?.doesDefaultCommunityExist) {
        return currentCommunity?.isDefaultCommunity ? "block" : "none";
      }
      return "none";
    }
    return "block";
  };

  const displayPublicCommunityTab = () => {
    if (isMyFeedButtonClicked) {
      if (currentCommunity?.doesDefaultCommunityExist) {
        return currentCommunity?.isDefaultCommunity ? "block" : "none";
      }
      return "block";
    }
    return "none";
  };

  useEffect(() => {
    setTabIndex(0);
    queryMyCommunity();
  }, []);

  return (
    <div className="mobile-container">
      <CommunityLeftCol
        isMobile={true}
        setTabIndex={setTabIndex}
        hideSidebar={hideSidebar}
        setHideSidebar={setHideSidebar}
      />
      <TopBar hideSidebar={hideSidebar} setHideSidebar={setHideSidebar} />

      <Tabs.Root
        value={`tab-${tabIndex}`}
        onValueChange={(val) => handleTabsChange(Number(val.split("-")[1]))}
      >
        <Tabs.List style={{ display: "flex", marginTop: "30px" }}>
          <Tabs.Trigger style={getTabStyle(0)} value="tab-0">
            Feed
          </Tabs.Trigger>
          <Tabs.Trigger
            style={{ ...getTabStyle(1), display: displayChatTab() }}
            value="tab-1"
          >
            Chat
          </Tabs.Trigger>
          <Tabs.Trigger
            style={{ ...getTabStyle(2), display: displayPublicCommunityTab() }}
            value="tab-2"
          >
            Public Communities
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="tab-0">
          <div onClick={hidePop}>
            {communityId && currentCommunity?._id && info.page === "eachcommunity" && (
              <CommunityHeader id={communityId} />
            )}
            {communityHeaderTab === "conversations" && <CreateBox />}
            {messageBox.status && <MessageBox />}
            {isEditCommunity && <EditCommunity />}
            {info.isCreateCommunity && <CreateCommunity />}
            {info.isModal && (
              <div
                className="homebox modal-backdrop fade show"
                onClick={() => dispatch(setModal(false))}
              ></div>
            )}
          </div>

          {userRole === "admin" && (
            <div onClick={hidePop}>
              {communityId && currentCommunity?._id && communityHeaderTab === "conversations" && (
                <CreatePost />
              )}
              <AdminPostList myCommunity={myCommunity} />
            </div>
          )}

          {userRole === "user" && (
            <div className="bg-middle-content">
              {(info.page === "eachcommunity" || info.page === "home") &&
                myCommunity && <PostList myCommunity={myCommunity} />}
              {(info.page === "suggestedCommunities" ||
                info.page === "myCommunities" ||
                info.page === "favoriteCommunities") && <CommunitiesPage />}
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="tab-1">
          <CommunityRightCol />
          {info.isCreateCommunity && isMobileView && <CreateCommunity />}
        </Tabs.Content>

        <Tabs.Content value="tab-2">
          <RightCol />
          {info.isCreateCommunity && isMobileView && <CreateCommunity />}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default MobileApp;
