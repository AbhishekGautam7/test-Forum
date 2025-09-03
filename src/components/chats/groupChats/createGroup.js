/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useState } from "react";

import { Form, Formik } from "formik";
import { CiSearch } from "react-icons/ci";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import { Button } from "reactstrap";
import * as yup from "yup";
import { setMessageBox, setMessageTxt } from "../../../redux";
import { FormikInput } from "../../formik";
import { useCreateGroup, useGetCommunityUsers } from "../hooks";
import Member from "./member";
import InfiniteScroller from "../modules/infiniteScroller";

const createGroupInitialValues = {
	groupName: "",
	members: [],
	includeAllUsers: false,
};

const createGroupValidationSchema = yup.object({
	groupName: yup
		.string()
		.required("Group Name is required")
		.min(2, "Group Name must be at least 2 characters.")
		.max(50, "Group Name must not be longer than 50 characters."),
	includeAllUsers: yup.boolean(),
	members: yup
		.array()
		.of(yup.string())
		.when("includeAllUsers", (includeAllUsers, schema) => {
			if (includeAllUsers[0]) {
				return schema.nullable().notRequired("Member is required");
			} else {
				return schema
					.min(1, "Atleast one member is required")
					.required("Member is required");
			}
		}),
});

const CreateGroup = ({
	setIsGroupDetailBoxOpen,
	setIsCreateGroupFormOpen,
	groupInfo,
	setGroupInfo,
	socket,
	communityUsers,
}) => {
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);
	const communityId = useSelector((state) => state.info.communityId);

	const { mutateAsync } = useCreateGroup();

	const joinRoom = ({ groupId, communityId }) => {
		socket
			.compress(false)
			.emit("enterGroup", { groupId, communityId }, (res) => {
				console.log("joined", res);
			});
	};

	const dispatch = useDispatch();

	const { communityUserList, fetchNextPage, hasNextPage, isLoading } =
		useGetCommunityUsers({ groupId: "" });

	const [isAPICall, setStartAPICall] = useState(false);

	const handleSubmit = (values) => {
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Creating Group..."));
		mutateAsync({
			appId,
			token,
			communityId,
			name: values["groupName"],
			includeAllUsers: values["includeAllUsers"],
			usersId: values["members"],
		}).then((res) => {
			if (res?.data?.metadata?.status !== "Error") {
				const userIds = res?.data?.data?.users?.map((item) => item?.user);

				const users = communityUsers.filter((user) =>
					userIds?.includes(user._id)
				);

				setGroupInfo({
					id: res?.data?.data?._id,
					name: res?.data?.data?.name,
					canUserSendMessage: res?.data?.data?.canUserSendMessage,
					canUserViewMessage: res?.data?.data?.canUserViewMessage,
					allowReaction: res?.data?.data?.allowReaction,
					allowComment: res?.data?.data?.allowComment,
					canUserViewComment: res?.data?.data?.canUserViewComment,
					users,
					communityId: res?.data?.data?.community,
					canUserViewReaction: res?.data?.data?.canUserViewReaction,
				});
				joinRoom({
					communityId: res?.data?.data?.community,
					groupId: res?.data?.data?._id,
				});
				setIsGroupDetailBoxOpen(true);
				setIsCreateGroupFormOpen(false);
			}
		});
	};

	return (
		<Formik
			initialValues={createGroupInitialValues}
			validationSchema={createGroupValidationSchema}
			enableReinitialize={true}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, isValid, dirty, values, setFieldValue, resetForm }) => {
				return (
					<Form className="d-flex flex-column gap-4 white-bg p-4">
						<FormikInput
							name="groupName"
							type="text"
							placeholder="Group Name"
							key="groupName"
						/>
						<div className="d-flex align-items-center justify-content-between">
							<div>
								<strong className="custom-black">All Members</strong>
								<p className="muted fs-7">
									You will have to select the members for this group manually if
									you disable the option
								</p>
							</div>

							<Switch
								onChange={(checked) => {
									return setFieldValue("includeAllUsers", checked);
								}}
								checked={values.includeAllUsers}
								uncheckedIcon={false}
								checkedIcon={false}
								onColor="#386cbb"
							/>
						</div>

						{!values.includeAllUsers && (
							<>
								{/* <div className="create-group-search-box-wrapper">
									<div className="chat-search-icon">
										<CiSearch />
									</div>
									<input placeholder="Search" />
								</div> */}
								<div
									style={{
										height: "50vh",
										overflowY: "auto",
									}}
								>
									<InfiniteScroller
										loadMore={async () => {
											if (isAPICall) return;
											setStartAPICall(true);
											await fetchNextPage();
											setTimeout(() => {
												setStartAPICall(false);
											}, 2000);
										}}
										hasMore={hasNextPage && !isAPICall}
									>
										{communityUserList &&
											communityUserList.length > 0 &&
											communityUserList.map((member) => (
												<Member
													key={member?._id}
													member={member}
													isAddOrRemoveGroupMembersBoxOpen={false}
												/>
											))}
										{communityUserList && communityUserList?.length === 0 && (
											<div
												className="w-100 d-flex justify-content-center align-items-center"
												style={{
													height: "400px",
												}}
											>
												No users found
											</div>
										)}
										{isLoading && (
											<div className="w-100 d-flex justify-content-center align-items-center">
												Loading users
											</div>
										)}
									</InfiniteScroller>
								</div>
							</>
						)}

						<div className="d-flex flex-column gap-2">
							<Button
								color="primary"
								className="w-100"
								disabled={isSubmitting || !isValid || !dirty}
								type="submit"
							>
								<FaCirclePlus className="me-2" />
								<strong>Create New Group</strong>
							</Button>

							<Button
								color="primary"
								className="w-100"
								outline
								type="button"
								onClick={() => setIsCreateGroupFormOpen(false)}
							>
								<IoIosArrowBack className="me-2" />
								<strong>Back</strong>
							</Button>
						</div>
					</Form>
				);
			}}
		</Formik>
	);
};

export default CreateGroup;
