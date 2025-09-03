import React from "react";
import CreateDiscussion from "./createPost/CreateDiscussion";
import CreatePoll from "./createPost/CreatePoll";
import CreateQuestion from "./createPost/CreateQuestion";
import CreatePraise from "./createPost/CreatePraise";
import { useSelector } from "react-redux";
import WelcomeCreatePost from "./createPost/WelcomeCreatePost";
import { useGetDefaultCommunity } from "../hooks/index";

function CreatePost() {
  const post = useSelector((state) => state.info.post);
  const userRole = useSelector((state) => state.myProfile.data.role);

  const { defaultCommunity } = useGetDefaultCommunity();

  return (
    <>
      {post === "discussion" ? (
        <CreateDiscussion />
      ) : post === "poll" ? (
        <CreatePoll />
      ) : post === "question" ? (
        <CreateQuestion />
      ) : post === "praise" ? (
        <CreatePraise />
      ) : userRole === "user" ? (
        defaultCommunity?.details?.chatSetting
          ?.canLearnerPostWithinCommunity === true ? (
          <WelcomeCreatePost />
        ) : (
          <></>
        )
      ) : (
        <WelcomeCreatePost />
      )}
    </>
  );
}

export default React.memo(CreatePost);
