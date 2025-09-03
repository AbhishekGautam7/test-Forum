import { useEffect, useState } from "react";

// Third party imports
import { useInfiniteQuery } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import { getCommunityList } from "../../../api";

function useGetCommunityList({
  state,
  search,
  isJoined,
  isCreator,
  isFavourite,
}) {
  const [communityList, setCommunityList] = useState([]);

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const communityId = useSelector((state) => state.info.communityId);

  const [pageLimit] = useState(20);

  const dispatch = useDispatch();

  const {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["communityList", { search, isFavourite, state, isCreator, isJoined }],
    queryFn: ({ pageParam = 1 }) =>
      getCommunityList({
        page: pageParam,
        limit: pageLimit,
        appId,
        token,
        state,
        search,
        isJoined,
        isCreator,
        isFavourite,
      }),
    getNextPageParam: (_lastPage, pages) => {
      const commmunityCount = pages[0]?.data?.data?.pagination?.total;
      const totalPages = Math.ceil(commmunityCount / pageLimit);
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess) {
      let allCommunityList = [];

      console.log("community list", { data });

      data?.pages?.forEach((page) => {
        page?.data?.data?.communities?.forEach((community) => {
          allCommunityList.push({ ...community });
        });
      });

      setCommunityList(allCommunityList);
    }
  }, [appId, data, isSuccess, token]);

  return {
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
    communityList,
    fetchNextPage,
    setCommunityList,
  };
}

export { useGetCommunityList };
