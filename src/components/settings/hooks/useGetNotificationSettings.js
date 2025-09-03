"use client";

// Util imports
import { useEffect, useState } from "react";

import { headers } from "../../../api/community";
import axios from "axios";

// Third party imports
import { useQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function useGetNotificationSettings() {
  const [notificationSettingsData, setNotificationSettingsData] = useState([]);

  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const getNotificationSettings = () => {
    let url = `${API_URL}/api/community/user/notif-settings/${communityId}`;

    return axios.get(url, {
      headers: headers({ token, appId }),
    });
  };

  const { data, error, isSuccess, isLoading, isError } = useQuery(
    ["notificationSettings"],
    getNotificationSettings,
    {
      refetchOnWindowFocus: false,
      enabled: !!communityId && !!token && !!appId,
    }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setNotificationSettingsData(data?.data?.data);
    }
  }, [data, isSuccess]);

  return { notificationSettingsData, isSuccess, isLoading, isError };
}

export { useGetNotificationSettings };
