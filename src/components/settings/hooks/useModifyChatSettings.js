import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeAdminChatSettings,
  changeCommunityAdminChatSettings,
} from "../../../api";
import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../../redux";

function useModifyChatSettings({ chatSettingType }) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutationFn =
    chatSettingType === "admin"
      ? changeAdminChatSettings
      : changeCommunityAdminChatSettings;

  const { isPending, mutate, mutateAsync } = useMutation({
    mutationFn,
    onSuccess: (data) => {
      // ✅ v5 requires array keys for queries
      queryClient.invalidateQueries({ queryKey: ["chatSettings"] });
      queryClient.invalidateQueries({ queryKey: ["adminChatSettings"] });
      queryClient.invalidateQueries({ queryKey: ["overAllChatSettings"] });

      if (data?.data?.metadata) {
        dispatch(setMessageTxt(data?.data?.metadata?.message));
      } else {
        dispatch(setMessageTxt(data?.data?.message));
      }
      setTimeout(() => {
        dispatch(setMessageBox(false));
      }, 1500);
    },
    onError: (error) => {
      console.log("error", error);
      dispatch(setMessageTxt(JSON.stringify(error, null, 2)));
      setTimeout(() => {
        dispatch(setMessageBox(false));
      }, 1500);
    },
  });

  return {
    mutate,
    isLoading: isPending, 
    mutateAsync,
  };
}

export { useModifyChatSettings };
