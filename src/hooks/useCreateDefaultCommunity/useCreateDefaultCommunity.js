import { useMutation, useQueryClient } from "@tanstack/react-query";
import { headers } from "../../api/community";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../redux";

const API_URL = process.env.REACT_APP_API_URL;

function useCreateDefaultCommunity() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  // ✅ Mutation function
  const createDefaultCommunity = async () => {
    const url = `${API_URL}/api/community/add-default-community`;
    const response = await axios.post(url, {}, { headers: headers({ token, appId }) });
    return response.data;
  };

  // ✅ useMutation with object syntax
  const { isLoading, mutate, mutateAsync } = useMutation({
    mutationFn: createDefaultCommunity,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["defaultCommunity"]);
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
    isLoading,
    mutateAsync,
  };
}

export { useCreateDefaultCommunity };
