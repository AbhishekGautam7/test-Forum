import React,{useEffect,useState} from "react";
import PropTypes from "prop-types";
import {
  setCommunityId,
  setCurrentCommunity,
  setPage,
  setPost,
  setCommuinityHeaderTab,
  setFeeds,
  hasMoreFeed,
  setFeedIdList,
  setTodaysCommunity,
  setFeedsName,setTotalFeed
} from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import { getCommunityDetail } from "../../api/community";
import { fetchOrgFeeds,getTodaysCommunity } from "../../api/orgAdmin";
function TodaysCommunity(props) {
  const data = useSelector((state) => state.todaysCommunity.data);
  const title = props.title;
  const userId = useSelector((state) => state.info.userId);
  const token = useSelector((state) => state.info.token);
  const appId = useSelector((state) => state.info.appId);
  const dispatch = useDispatch();
  useEffect(() => {
    let abortController = new AbortController();
    todaysCommunityList();
    return () => {
        abortController.abort();
    };
  }, []);


  const todaysCommunityList = async () => {
    try {
      let date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
  
      // const currentDate = date.toLocaleDateString();
      const currentDate = year + "-" + month + "-" + day;
  
      let payload = {
        currentDate,
        deleted: false,
        appId,
        token
      };
      await getTodaysCommunity(payload)
        .then((res) => {
          if (res && res.status && res.status === 200) {
            dispatch(setTodaysCommunity(res?.data?.data));
            dispatch(setFeedIdList(res?.list?.map((item) => item._id)));
            dispatch(hasMoreFeed(res?.metadata?.hasMore));   
            dispatch(setFeedsName("home"));   
            dispatch(setTotalFeed(res?.metadata?.totalCount)); 
          } else {
            console.log("Something error on queryFavoriteCommunityList");
          }
          // dispatch(setFavorite(res));
        })
        .catch((error) => {
          console.log("Error on getFavoriteCommunityList", error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const setCommunity = (item) => {
    console.log("setCommunity.............", item);
    getCommunityDetail({
      communityId: item._id,
      appId,
      token
    })
      .then((response) => {
        console.log("getCommunityDetail", response);
        if (response && response.status && response.status === 200) {
          dispatch(setPost(""));
          dispatch(setCommunityId(item._id));
          dispatch(setCurrentCommunity(response.data.data));
          dispatch(setPage("eachcommunity"));


          dispatch(setCommuinityHeaderTab());
          fetchOrgFeeds({
            communityId: item._id,
            appId,
            token
          }).then((response) => {
            dispatch(setFeeds(response.list));
            dispatch(setFeedIdList(response.list.map(item=>item._id)));
            dispatch(hasMoreFeed(response.metadata.hasMore))
            
          });
        }
      })
      .catch((error) => console.log("Error on getCommunityDetail", error));
  };
  const viewAll = ()=>{
    try{
      dispatch(setPage("todaysCommunities"));
    }catch(error){
      console.error(error);
    }
  }
  return (
    <ul className="communities-list">
      <li>
        <div className="title">
          <img
            src={process.env.REACT_APP_SITE_URL + "icon-favourites.svg"}
            alt="favourite"
            loading="lazy"
          />
          <span>{title}</span>
        </div>
        <ul>
          {data &&
            data.length > 0 &&
            data.map((item,index) => {
              return index<5 && (
                <li key={item._id} onClick={() => setCommunity(item)}>
                  <button >
                    <div>
                      {item.state && item.state === "Public" && (
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL + "icon-globe.svg"
                          }
                          alt="Public Community"
                          title="Public Community"
                          loading="lazy"
                        />
                      )}
                      {item.state && item.state === "Private" && (
                        <img
                          src={
                            process.env.REACT_APP_SITE_URL +
                            "icon-lock-light.svg"
                          }
                          alt="Private Community"
                          title="Private Community"
                          loading="lazy"
                        />
                      )}
                      <span>{item.name}</span>
                        {item.createdBy === userId && <img className="star" alt="Favorite Community" title="Favorite Community" src={process.env.REACT_APP_SITE_URL +
                                "admin_star.svg"} />} 
                    </div>
                    <div>
                      <span>
                        {item &&
                          item.communityUsers &&
                          item.communityUsers.length}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {
              data && data.length>5 && <li><button className="view-all" onClick={()=>viewAll()}><img src={process.env.REACT_APP_SITE_URL + "icon-blue-arrow-down.svg"} alt="view all" loading="lazy" /> View All</button></li>
            }
            
        </ul>
        
      </li>
     
    </ul>
  );
}
export default TodaysCommunity;
