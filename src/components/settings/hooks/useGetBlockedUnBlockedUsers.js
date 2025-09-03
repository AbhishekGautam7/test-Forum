import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";

import { headers } from "../../../api/community";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function useGetBlockedUnBlockedUsers() {
	const [userList, setUserList] = useState(null);
	const [isBlocked, setIsBlocked] = useState(true);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);

	const communityUsers = useSelector(
		(state) => state.currentCommunity.data.communityUsers
	);

	const [pageLimit] = useState(15);

	const [search, setSearch] = useState("");

	const getBlockedUnBlockedUsers = ({ pageParam = 1 }) => {
		let url = `${API_URL}/api/community/user/community-users?communityId=${communityId}&page=${pageParam}&limit=${pageLimit}&search=${search}&blocked=${isBlocked}`;

		if (isBlocked === true) {
			url = url + `&blocked=${true}`;
		} else if (isBlocked === false) {
			url = url + `&blocked=${false}`;
		}

		if (isBlocked === true) {
			url = url + `&blocked=${true}`;
		} else if (isBlocked === false) {
			url = url + `&blocked=${false}`;
		}

		if (isBlocked === true) {
			url = url + `&blocked=${true}`;
		} else if (isBlocked === false) {
			url = url + `&blocked=${false}`;
		}

		return axios.get(url, {
			headers: headers({ token, appId }),
		});
	};

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
		["blockedUnBlockedUserList", { communityId, search, isBlocked }],
		getBlockedUnBlockedUsers,
		{
			getNextPageParam: (_lastPage, pages) => {
				let totalCount = pages[0].data.data.totalData;

				const totalPages = Math.ceil(totalCount / pageLimit);

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
				return page.data.data.data.map(async (group) => {
					return allUserList.push({
						...group,
					});
				});
			});

			setUserList(allUserList);
		}
	}, [appId, communityUsers, data, isSuccess, token]);

	return {
		isSuccess,
		isLoading,
		userList,
		hasNextPage,
		fetchNextPage,
		isFetching,
		setSearch,
		setIsBlocked,
		isBlocked,
	};
}

export { useGetBlockedUnBlockedUsers };
