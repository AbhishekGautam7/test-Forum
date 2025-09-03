import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";
import { useSelector } from "react-redux";
import { headers } from "../../../api/community";

const API_URL = process.env.REACT_APP_API_URL;

function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const updateNotificationSettings = (values) => {
    let url = `${API_URL}/api/community/user/notif-settings`;

    console.log({ values });

    let data = {
      communityId: communityId,
      muteChatPushNotif: values.muteChatPushNotif,
      muteGroupPushNotif: values.muteGroupPushNotif,
      muteNoticePushNotif: values.muteNoticePushNotif,
    };

    return axios.put(url, data, {
      headers: headers({ token, appId }),
    });
  };

  const { isLoading, mutate, mutateAsync } = useMutation(
    updateNotificationSettings,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("notificationSettings");

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

export { useUpdateNotificationSettings };
