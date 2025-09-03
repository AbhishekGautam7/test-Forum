"use client";

// Util imports
import { useState, useEffect } from "react";
import axios from "axios";
import { headers } from "../../api/community";

// Third party imports
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL;

function useGetCommunityNames() {
  const [communityNamesData, setCommunityNamesData] = useState();

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const getCommunityNames = async () => {
    const url = `${API_URL}/api/community/names`;
    const response = await axios.get(url, {
      headers: headers({ token, appId }),
    });
    return response.data;
  };

  const { data, isSuccess, isFetching, isError } = useQuery({
    queryKey: ["communityNames"],
    queryFn: getCommunityNames,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setCommunityNamesData(data?.data);
    }
  }, [data, isSuccess]);

  return { communityNamesData, isSuccess, isLoading: isFetching, isError };
}

export { useGetCommunityNames };
