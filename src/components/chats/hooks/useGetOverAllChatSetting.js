"use client";

import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { headers } from "../../../api/community";

const API_URL = process.env.REACT_APP_API_URL;

export function useGetOverAllChatSetting() {
  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const getAdminChatSettings = async () => {
    const url = `${API_URL}/api/community/single-chat-settings/${communityId}`;
    const response = await axios.get(url, {
      headers: headers({ token, appId }),
    });
    return response.data?.data?.data ?? {};

  };

  const query = useQuery({
    queryKey: ["overAllChatSettings", communityId],
    queryFn: getAdminChatSettings,
    refetchOnWindowFocus: false,
    enabled: !!communityId,
  });

  // query already has: data, isLoading, isError, isSuccess, etc.
  return query;
}
