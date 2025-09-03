import {
    SET_FEEDS,
    ADD_FEED,
    SET_COMMENT_STATUS,
    SET_COMMENT_COUNT,
    DELETE_FEEDS_BY_COMMUNITY_ID,
    DELETE_ALL_POST,
    DELETE_FEED_BY_ID,
    SET_FEED_MODE,
    SET_FEED_USERS,
    SET_FEED,
    DELETE_FEED_BY_ADMIN,
    RESTORE_FEED_BY_ADMIN,
    SET_FEEDS_NAME,
    REMOVE_LAST_FEED,
    HAS_MORE_FEED,
    SET_FEED_ID_LIST,
    DELETE_FEED_ID_LIST_BY_ID,
    ADD_FEED_ID_LIST_BY_ID,
    SET_TOTAL_FEED,
    SET_FEED_DELETED_STATUS
} from "./Types";

const initialState = {
    data: [],
    perPageFeed: 20,
    name: "",
    hasMoreFeed: false,
    feedIdList: [],
    total: 0
};

const feedsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FEEDS:
            return {
                ...state,
                data: action.payload,
            };

        case ADD_FEED:
            return {
                ...state,
                data: [action.payload, ...state.data],
            };
        case ADD_FEED_ID_LIST_BY_ID:
            return {
                ...state,
                feedIdList: [action.payload, ...state.feedIdList],
            };
        case DELETE_ALL_POST:
            return {
                ...state,
                data: [],
            };
        case DELETE_FEEDS_BY_COMMUNITY_ID:
            return {
                ...state,
                data: [...state.data].filter(
                    (item) => item._communityId !== action.payload
                ),
            };
        case DELETE_FEED_BY_ID:
            return {
                ...state,
                data: [...state.data].filter((item) => item._id !== action.payload),
            };
        case DELETE_FEED_ID_LIST_BY_ID:
            console.log("DELETE_FEED_ID_LIST_BY_ID");

            console.log([...state.feedIdList].filter((item) => item !== action.payload));

            return {
                ...state,
                feedIdList: [...state.feedIdList].filter((item) => item !== action.payload),
            };
        case DELETE_FEED_BY_ADMIN:
            let cloneState = [...state.data];

            let objIndex = cloneState.findIndex(
                (obj1) => obj1._id === action.payload
            );

            cloneState[objIndex].deleted = true;
            return {
                ...state,
                data: cloneState,
            };

        case RESTORE_FEED_BY_ADMIN:
            // console.log("RESTORE_FEED_BY_ADMIN:");
            const cloneState5 = [...state.data];

            let objIndex1 = cloneState5.findIndex(
                (obj1) => obj1._id === action.payload
            );

            cloneState5[objIndex1].deleted = false;

            return {
                ...state,
                data: cloneState5,
            };

        case SET_COMMENT_STATUS:
            let cloneState1 = [...state.data];

            let obj = cloneState1.find((item) => item._id === action.payload);
            let index = cloneState1.indexOf(obj);
            if (!cloneState1[index].commentStatus) {
                cloneState1[index].commentStatus = true;
            } else {
                cloneState1[index].commentStatus = false;
            }
            return {
                ...state,
                data: cloneState1,
            };
            
            case SET_FEED_DELETED_STATUS:
                let cloneState115 = [...state.data];
    
                let obj115 = cloneState115.find((item) => item._id === action.payload._id);
                let index115 = cloneState115.indexOf(obj115);
                console.log(action.payload);
                cloneState115[index115].deleted = action.payload.status;
                return {
                    ...state,
                    data: cloneState115,
                };
            

        case SET_COMMENT_COUNT:
            let cloneState100 = [...state.data];

            let obj100 = cloneState100.find(
                (item) => item._id === action.payload.feedId
            );
            let index100 = cloneState100.indexOf(obj100);
            cloneState100[index100].commentCount = action.payload.commentCount;
            console.log(cloneState100[index100]);
            return {
                ...state,
                data: cloneState100,
            };
        case SET_FEED_MODE:
            let cloneState2 = [...state.data];
            console.log("payload", action.payload);
            let feedObj = cloneState2.find((item) => item._id === action.payload.id);
            let indexObj = cloneState2.indexOf(feedObj);

            cloneState2[indexObj].mode = action.payload.mode;

            console.log(cloneState2[indexObj]);
            return {
                ...state,
                data: cloneState2,
            };

        case SET_FEED_USERS:
            let cloneState3 = [...state.data];
            let feedObj1 = cloneState3.find((item) => item._id === action.payload.id);
            let indexObj1 = cloneState3.indexOf(feedObj1);
            cloneState3[indexObj1].users = action.payload.users ?
                action.payload.users :
                [];

            return {
                ...state,
                data: cloneState3,
            };

        case SET_FEEDS_NAME:
            return {
                ...state,
                name: action.payload,
            };


        case SET_FEED:
            let cloneState4 = [...state.data];
            let feedObj2 = cloneState4.find(
                (item) => item._id === action.payload._id
            );
            let indexObj2 = cloneState4.indexOf(feedObj2);
            cloneState4[indexObj2] = action.payload;
            //let indexObj
            return {
                ...state,
                data: cloneState4,
            };

        case REMOVE_LAST_FEED:
            return {
                ...state,
                data: [...state.data].slice(0, -1),
            };

        case HAS_MORE_FEED:
            return {
                ...state,
                hasMoreFeed: action.payload,
            };

        case SET_FEED_ID_LIST:
            return {
                ...state,
                feedIdList: action.payload,
            };
        case SET_TOTAL_FEED:
            return {
                ...state,
                total: action.payload,
            };

        default:
            return state;
    }
};

export default feedsReducer;