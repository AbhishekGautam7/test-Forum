"use client";

// Util imports
import { useState, useEffect } from "react";
import axios from "axios";
import { headers } from "../../../api/community";

// Third party imports
import { useQuery } from "@tanstack/react-query";

// Redux imports
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function useGetGroupChatSettings(groupId) {
  const [groupChatSettings, setGroupChatSettingsData] = useState();

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const getGroupChatSettings = async () => {
    const url = `${API_URL}/api/group/${groupId}`;
    const response = await axios.get(url, {
      headers: headers({ token, appId }),
    });
    return response.data?.data; 
  };

  const {
    data,
    error,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["groupChatSettings", groupId], 
    queryFn: getGroupChatSettings,
    refetchOnWindowFocus: false,
    enabled: !!groupId,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setGroupChatSettingsData(data);
    }
  }, [data, isSuccess]);

  return { groupChatSettings, isSuccess, isLoading, isError, error };
}

export { useGetGroupChatSettings };
