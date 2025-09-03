import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";
import { getCommunityGroupList } from "../../../api";

function useGetCommunityGroupList({
	communityId,
	activeTab,
	setCommunityGroupList,
}) {
	// const { communityGroupList, setCommunityGroupList } = useChatStore(
	// 	(store) => store
	// );
	// const [communityGroupList, setCommunityGroupList] = useState(null);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);

	const [search, setSearch] = useState("");

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(12);

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
		["communityGroupList", { communityId, search, activeTab }],
		({ pageParam = 1 }) =>
			getCommunityGroupList({
				communityId,
				page: pageParam,
				limit: pageLimit,
				appId,
				token,
				search,
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
			enabled: !!communityId && activeTab === "groups",
		}
	);

	useEffect(() => {
		if (isSuccess) {
			let allGroupList = [];

			data?.pages.map((page) => {
				return page.data.data.groups.map(async (group) => {
					const groupUserIds = group.users.map((user) => user.user);
					return allGroupList.push({
						...group,
						users: group?.includeAllUsers
							? communityUsers
							: communityUsers?.filter((user) =>
									groupUserIds.includes(user._id)
							  ),
					});
				});
			});

			setCommunityGroupList(allGroupList);
		}
	}, [appId, communityUsers, data, isSuccess, setCommunityGroupList, token]);

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
		// communityGroupList,
		hasNextPage,
		fetchNextPage,
		isFetching,
		search,
		setSearch,
	};
}

export { useGetCommunityGroupList };
