import { combineReducers } from "redux";

import communityReducer from "./community/Reducer";
import infoReducer from "./info/Reducer";
import favoriteReducer from "./favorite/Reducer";
import myCommunityReducer from "./mycommunity/Reducer";
import publicCommunityReducer from "./public_community/Reducer";
import messageBoxReducer from "./messagebox/Reducer";
import feedsReducer from "./feeds/Reducer";
import currentCommunityReducer from "./current_community/Reducer";
import myProfileReducer from "./my_profile/Reducer";
import confirmMessageBoxReducer from "./confirmbox/Reducer";
import allCommunityReducer from "./allcommunity/Reducer";
import todayCommunityReducer from "./todays_community/Reducer";
import searchReducer from "./search/Reducer";
import searchBoxReducer from "./searchBox/Reducer";
import socketReducer from "./socket/Reducer";

export default combineReducers({
	community: communityReducer,
	info: infoReducer,
	favorite: favoriteReducer,
	myCommunity: myCommunityReducer,
	publicCommunity: publicCommunityReducer,
	messageBox: messageBoxReducer,
	feeds: feedsReducer,
	currentCommunity: currentCommunityReducer,
	myProfile: myProfileReducer,
	confirmBox: confirmMessageBoxReducer,
	allCommunity: allCommunityReducer,
	todaysCommunity: todayCommunityReducer,
	search: searchReducer,
	searchBox: searchBoxReducer,
	socket: socketReducer,
});
