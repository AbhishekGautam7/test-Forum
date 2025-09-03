import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getCommunityListForChat } from "../../api/community";

function useGetCommunityListForChat() {
  const [communityList, setCommunityList] = useState([]);

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const communityId = useSelector((state) => state.info.communityId);

  const [searchValue, setSearchValue] = useState("");
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
    queryKey: ["communityList", { search: searchValue }],
    queryFn: ({ pageParam = 1 }) =>
      getCommunityListForChat({
        page: pageParam,
        appId,
        token,
        search: searchValue,
      }),
    getNextPageParam: (_lastPage, pages) => {
      const communityCount = pages[0]?.data?.data?.pagination?.total || 0;
      const totalPages = Math.ceil(communityCount / pageLimit);
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const allCommunityList = data.pages.flatMap((page) =>
        page?.data?.data?.communities?.map((community) => ({
          value: community._id,
          label: community.name,
          ...community,
        })) || []
      );

      setCommunityList(allCommunityList);
    }
  }, [data, isSuccess]);

  return {
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
    communityList,
    fetchNextPage,
    setCommunityList,
    setSearchValue,
    searchValue,
  };
}

export { useGetCommunityListForChat };
