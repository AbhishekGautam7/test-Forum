import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { headers } from "../../../api/community";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function useGetCommunityMembersForPrivateChat() {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(null);

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);
  const communityId = useSelector((state) => state.info.communityId);

  const getCommunityMembersForPrivateChat = async () => {
    const url = `${API_URL}/api/community/user/list-for-chat?communityId=${communityId}&searchKey=${search}`;
    const response = await axios.get(url, {
      headers: headers({ token, appId }),
    });
    return response.data;
  };

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["communityMembersForPrivateChat", communityId, search],
    queryFn: getCommunityMembersForPrivateChat,
    refetchOnWindowFocus: false,
    enabled: !!communityId, // only run if communityId exists
  });

  useEffect(() => {
    if (isSuccess) {
      setUserList(data?.data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (!search) {
      setUserList(null);
    }
  }, [search]);

  return {
    isLoading,
    userList,
    search,
    setSearch,
  };
}

export { useGetCommunityMembersForPrivateChat };
