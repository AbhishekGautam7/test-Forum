import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllFeed,
  getAllPublicCommunityList,
  joinCommunityAPI,
  joinCommunityEmail,
} from "../api/community";
import {
  addMyCommunity,
  removePublicCommunity,
  setFeedIdList,
  setFeeds,
  setMessageBox,
  setMessageBoxCloseBtn,
  setMessageTxt,
  setModal,
  setPage,
  setPost,
  setPublicCommunity,
} from "../redux";
import MemberList from "./modules/MemberList";

function PublicCommunity() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.info.userId);
  const userRole = useSelector((state) => state.myProfile.data.role);
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const data = useSelector((state) => state.publicCommunity.data);
  const allCommunity = useSelector((state) => state.allCommunity);
  const queryClient = useQueryClient();

  useEffect(() => {
    let abortController = new AbortController();
    let payload = {
      count: 10,
      appId,
      token,
    };
    console.log(userRole);
    if (userRole === "user") {
      console.log("Get All Public");
      getAllPublicCommunityList(payload).then((res) => {
        if (res) {
          dispatch(setPublicCommunity(res));
        }
      });
    } else {
      console.log("Public Community", allCommunity);
      dispatch(setPublicCommunity(allCommunity.data));
    }

    return () => {
      abortController.abort();
    };
  }, [userRole]);
  useEffect(() => {
    let abortController = new AbortController();
    dispatch(setPublicCommunity(allCommunity.data));

    return () => {
      abortController.abort();
    };
  }, [allCommunity]);
  const fetchFeeds = () => {
    getAllFeed({
      appId,
      token,
    })
      .then((res) => {
        dispatch(setFeeds(res.list));

        dispatch(setFeedIdList(res.list.map((item) => item._id)));
        dispatch(setPage("home"));
        dispatch(setMessageTxt("Successfully Joined Community"));
        dispatch(setMessageBoxCloseBtn(true));
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        // setTimeout(() => {
        //   dispatch(setModal(false));
        //   dispatch(setMessageTxt(""));
        //   dispatch(setMessageBox(false));
        //   dispatch(setMessageBoxCloseBtn(true));
        // }, 2000);
      })
      .catch((error) => console.error(error.res));
  };

  const joinCommunity = async (item) => {
    let payload = {
      communityId: item._id,
      appId,
      token,
    };
    dispatch(setMessageBox(true));
    dispatch(setMessageTxt("Joining Community ..."));
    dispatch(setMessageBoxCloseBtn(false));
    joinCommunityAPI(payload)
      .then((response) => {
        if (
          response &&
          response.data &&
          response.data.metadata &&
          response.data.metadata.statusCode === 200 &&
          response.data.metadata.message
        ) {
          let payload = {
            communityUserCount: item.communityUsers.length + 1,
            communityUsers: [...item.communityUsers, userId],
            name: item.name,
            _id: item._id,
            state: item.state,
          };
          dispatch(addMyCommunity(payload));
          dispatch(removePublicCommunity(item._id));
          dispatch(setMessageBox(true));
          dispatch(setModal(true));
          dispatch(setPost(""));
          dispatch(setMessageTxt("Sending Email after joining community ..."));
          joinCommunityEmail({
            communityName: item.name,
            communityId: item._id,
            token,
            appId,
            type: "withPushNotification",
          })
            .then((emailResponse) => {
              if (emailResponse.status === 200) {
                fetchFeeds();
              } else {
                dispatch(
                  setMessageTxt(
                    "Having issue while sending email after joining community"
                  )
                );
                dispatch(setMessageBoxCloseBtn(true));
              }
            })
            .catch((error) => {
              dispatch(
                setMessageTxt(
                  "Having issue while sending email after joining community"
                )
              );
              dispatch(setMessageBoxCloseBtn(true));
              console.error(error);
            });
        }
        if (
          response &&
          response.data &&
          response.data.metadata &&
          response.data.metadata.message &&
          response.status === 422
        ) {
          dispatch(setMessageBox(true));
          dispatch(setMessageTxt(response.data.metadata.message));
          dispatch(setMessageBoxCloseBtn(true));
          dispatch(setModal(true));
          dispatch(setPost(""));
        }
        queryClient.invalidateQueries("communityList");
      })
      .catch((error) => console.error("catch messg :", error));
  };
  const showSuggestCommunitiesPage = () => {
    dispatch(setPage("suggestedCommunities"));
  };
  return (
    <div className="community-right-sidebar">
      <div className="default-member-title-wrap">
        <span className="suggested-title">
          {userRole === "user" ? "Public Communities" : "All Communities"}
        </span>

        {/* {userRole === "user" && data && data.length > 5 && (
					<button
						className="linkBtn"
						onClick={() => showSuggestCommunitiesPage()}
					>
						View All
					</button>
				)}

				{userRole === "admin" && data && data.length > 5 && (
					<button
						className="linkBtn"
						onClick={() => dispatch(setPage("allCommunities"))}
					>
						View All
					</button>
				)} */}
      </div>

      {data &&
        data.length > 0 &&
        data.map((item, index) => {
          return (
            index < 10 && (
              <div className="communities-box" key={item._id}>
                <div className="communities-intro-banner">
                  <img
                    src={
                      item.bannerImage
                        ? item.bannerImage
                        : process.env.REACT_APP_SITE_URL + "morning.jpg"
                    }
                    alt="suggested communities"
                    loading="lazy"
                  />
                </div>
                {item.communityUsers && item.communityUsers.length > 0 && (
                  <MemberList data={item.communityUsers} />
                )}

                <div className="communities-intro-members">
                  <span className="title">{item.name && item.name}</span>
                  <span className="total-members">
                    {item.communityUsers ? item.communityUsers.length : 0}{" "}
                    members
                  </span>
                  {userRole === "admin" ? (
                    ""
                  ) : (
                    <button
                      onClick={() => joinCommunity(item)}
                      className="joint-community-btn common-community-btn"
                    >
                      Join Community
                    </button>
                  )}
                </div>
              </div>
            )
          );
        })}
    </div>
  );
}

export default PublicCommunity;
