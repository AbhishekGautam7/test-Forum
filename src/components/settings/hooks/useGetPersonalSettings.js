"use client";

// Util imports
import { useEffect, useState } from "react";

import { headers } from "../../../api/community";
import axios from "axios";

// Third party imports
import { useQuery } from "@tanstack/react-query";

import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function useGetPersonalSettings() {
  const [personalSettingsData, setPersonalSettingsData] = useState({});

  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const getPersonalSettings = () => {
    let url = `${API_URL}/api/community/user/personal-chat-setting/${communityId}`;

    return axios.get(url, {
      headers: headers({ token, appId }),
    });
  };

  const { data, error, isSuccess, isLoading, isError } = useQuery(
    ["personalSettings"],
    getPersonalSettings,
    {
      refetchOnWindowFocus: false,
      enabled: !!communityId && !!token && !!appId,
    }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setPersonalSettingsData(data?.data?.data);
    }
  }, [data, isSuccess]);

  return { personalSettingsData, isSuccess, isLoading, isError };
}

export { useGetPersonalSettings };
