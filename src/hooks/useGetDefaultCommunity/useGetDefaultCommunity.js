"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { headers } from "../../api/community";

const API_URL = process.env.REACT_APP_API_URL;

function useGetDefaultCommunity() {
  const [defaultCommunity, setDefaultCommunity] = useState();

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const { data, error, isSuccess, isLoading, isError } = useQuery({
    queryKey: ["defaultCommunity", appId, token],
    queryFn: async () => {
      const url = `${API_URL}/api/community/default-community`;
      const res = await axios.get(url, {
        headers: headers({ token, appId }),
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!appId && !!token,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setDefaultCommunity(data?.data?.data);
    }
  }, [data, isSuccess]);

  return { defaultCommunity, isSuccess, isLoading, isError };
}

export { useGetDefaultCommunity };
