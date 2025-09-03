import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";
import { useSelector } from "react-redux";
import { headers } from "../../../api/community";

const API_URL = process.env.REACT_APP_API_URL;

function useUpdatePersonalSettings() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const updatePersonalSettings = (values) => {
    let url = `${API_URL}/api/community/user/personal-chat-setting`;

    console.log({ values });

    let data = {
      communityId: communityId,
      personalChatSetting: {
        stopAddingToGroup: values.stopAddingToGroup,
        optOutGettingNotices: values.optOutGettingNotices,
      },
    };

    return axios.post(url, data, {
      headers: headers({ token, appId }),
    });
  };

  const { isLoading, mutate, mutateAsync } = useMutation(
    updatePersonalSettings,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("personalSettings");

        if (data?.data?.metadata) {
          dispatch(setMessageTxt(data?.data?.metadata?.message));
        } else {
          dispatch(setMessageTxt(data?.data?.message));
        }
        setTimeout(() => {
          dispatch(setMessageBox(false));
        }, 1500);
      },
      onError(error, variables, context) {
        console.log("error", error);
        dispatch(setMessageTxt(JSON.stringify(error, null)));
        setTimeout(() => {
          dispatch(setMessageBox(false));
        }, 1500);
      },
    }
  );

  return {
    mutate,
    isLoading,
    mutateAsync,
  };
}

export { useUpdatePersonalSettings };
