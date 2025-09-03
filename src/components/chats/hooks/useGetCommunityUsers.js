import { useState, useEffect } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { getCommunityUserList } from "../../../api";
import { useSelector } from "react-redux";

function useGetCommunityUsers({ groupId }) {
	const [communityUserList, setCommunityUserList] = useState(null);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);

	const [groupMembersOnly, setGroupMembersOnly] = useState();

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(9);

	const {
		data,
		error,
		isLoading,
		isSuccess,
		isError,
		hasNextPage,
		isFetching,
		fetchNextPage,
	} = useInfiniteQuery(
		["communityGroupUserList", { communityId, groupId, groupMembersOnly }],
		({ pageParam = 1 }) =>
			getCommunityUserList({
				communityId,
				page: pageParam,
				groupId,
				limit: pageLimit,
				appId,
				token,
				groupMembersOnly,
			}),
		{
			getNextPageParam: (_lastPage, pages) => {
				let groupsCount = pages[0].data.data.total;

				const totalPages = Math.ceil(groupsCount / pageLimit);

				if (pages.length < totalPages) {
					return pages.length + 1;
				} else {
					return undefined;
				}
			},
			refetchOnWindowFocus: false,
			enabled: !!communityId,
		}
	);

	useEffect(() => {
		if (isSuccess) {
			let allUserList = [];

			data?.pages.map((page) => {
				return page.data.data.userList.map(async (group) => {
					return allUserList.push({
						...group,
						detail: communityUsers.find((user) => user._id === group.userId),
					});
				});
			});

			setCommunityUserList(allUserList);
		}
	}, [appId, communityUsers, data, isSuccess, token]);

	// useEffect(() => {
	// 	if (isError) {
	// 		Notification({
	// 			message: "Unable to get group list, please try again later",
	// 			type: "warning",
	// 			title: "Warning",
	// 		});
	// 	}
	// }, [error, isError]);

	return {
		isSuccess,
		isLoading,
		communityUserList,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setGroupMembersOnly,
	};
}

export { useGetCommunityUsers };
