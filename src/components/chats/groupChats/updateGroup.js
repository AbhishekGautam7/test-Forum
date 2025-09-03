/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import React from "react";

import { Form, Formik } from "formik";
import Switch from "react-switch";
import { Button } from "reactstrap";
import { FormikInput } from "../../formik";

import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { setMessageBox, setMessageTxt } from "../../../redux";
import { useUpdateGroup } from "../hooks/useUpdateGroup";

const updateGroupValidationSchema = yup.object({
	groupName: yup
		.string()
		.required("Group Name is required")
		.min(2, "Group Name must be at least 2 characters.")
		.max(50, "Group Name must not be longer than 50 characters."),
	canUserSendMessage: yup.boolean(),
	canUserViewMessage: yup.boolean(),
	allowReaction: yup.boolean(),
	canUserViewReaction: yup.boolean(),
	allowComment: yup.boolean(),
	canUserViewComment: yup.boolean(),
});

const UpdateGroup = ({
	setIsGroupDetailBoxOpen,
	setIsCreateGroupFormOpen,
	groupInfo,
	setGroupId,
	setIsGroupSettingBoxOpen,
	chatSetting,
	setGroupInfo,
	communityUsers,
	groupChatSettings,
	isLoading,
}) => {
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);

	const { mutateAsync } = useUpdateGroup();

	const dispatch = useDispatch();

	const handleSubmit = (values) => {
		console.log({ values });

		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Updating Group..."));

		mutateAsync({
			appId,
			token,
			groupId: groupInfo?.id,
			name: values["groupName"],
			canUserSendMessage: values?.canUserSendMessage,
			canUserViewMessage: values?.canUserViewMessage,
			allowReaction: values?.allowReaction,
			allowComment: values?.allowComment,
			canUserViewComment: values?.canUserViewComment,
			canUserViewReaction: values?.canUserViewReaction,
		}).then((res) => {
			console.log({ res });
			setGroupInfo((prevInfo) => {
				return { ...prevInfo, name: res.data.data.name };
			});

			setIsGroupDetailBoxOpen(true);
			setIsCreateGroupFormOpen(false);
		});
	};

	const { groupChat } = chatSetting;
	const group = groupChatSettings?.group;

	return (
		<Formik
			initialValues={{
				groupName: group?.name,
				canUserSendMessage: group?.canUserSendMessage,
				canUserViewMessage: group?.canUserViewMessage,
				allowReaction: group?.allowReaction,
				allowComment: group?.allowComment,
				canUserViewComment: group?.canUserViewComment,
				canUserViewReaction: group?.canUserViewReaction,
			}}
			validationSchema={updateGroupValidationSchema}
			enableReinitialize={true}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, isValid, dirty, values, setFieldValue }) => {
				return (
					<Form
						className="d-flex flex-column gap-4 white-bg p-4"
						style={{ height: "calc(100vh - 215px)", overflow: "auto" }}
					>
						<FormikInput
							name="groupName"
							type="text"
							placeholder="Group Name"
							key="groupName"
						/>
						<div className="d-flex align-items-center justify-content-between">
							<div>
								<strong
									style={{
										fontSize: "0.9rem",
									}}
									className="custom-black"
								>
									Allow user to send Message
								</strong>
								<p className="muted fs-7">
									User can send message when you enable this option.
								</p>
							</div>

							<div style={{ marginLeft: "6px" }}>
								<Switch
									onChange={(checked) =>
										setFieldValue("canUserSendMessage", checked)
									}
									checked={values.canUserSendMessage}
									uncheckedIcon={false}
									checkedIcon={false}
									onColor="#386cbb"
								/>
							</div>
						</div>
						<div className="d-flex align-items-center justify-content-between">
							<div>
								<strong
									style={{
										fontSize: "0.9rem",
									}}
									className="custom-black"
								>
									Allow user to view message
								</strong>
								<p className="muted fs-7">
									User can view message when you enable this option.
								</p>
							</div>

							<div style={{ marginLeft: "6px" }}>
								<Switch
									onChange={(checked) =>
										setFieldValue("canUserViewMessage", checked)
									}
									checked={values.canUserViewMessage}
									uncheckedIcon={false}
									checkedIcon={false}
									onColor="#386cbb"
								/>
							</div>
						</div>
						{groupChat.reaction.isEnabled && (
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<strong
										style={{
											fontSize: "0.9rem",
										}}
										className="custom-black"
									>
										Allow user to react
									</strong>
									<p className="muted fs-7">
										User can react on message or post when you enable this
										option.
									</p>
								</div>

								<div style={{ marginLeft: "6px" }}>
									<Switch
										onChange={(checked) =>
											setFieldValue("allowReaction", checked)
										}
										checked={values.allowReaction}
										uncheckedIcon={false}
										checkedIcon={false}
										onColor="#386cbb"
									/>
								</div>
							</div>
						)}

						{groupChat.reaction.isVisibleToUsers && (
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<strong
										style={{
											fontSize: "0.9rem",
										}}
										className="custom-black"
									>
										Allow user to view react
									</strong>
									<p className="muted fs-7">
										User can view react on message or post when you enable this
										option.
									</p>
								</div>

								<div style={{ marginLeft: "6px" }}>
									<Switch
										onChange={(checked) =>
											setFieldValue("canUserViewReaction", checked)
										}
										checked={values.canUserViewReaction}
										uncheckedIcon={false}
										checkedIcon={false}
										onColor="#386cbb"
									/>
								</div>
							</div>
						)}

						{groupChat.comment.isEnabled && (
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<strong
										style={{
											fontSize: "0.9rem",
										}}
										className="custom-black"
									>
										Allow user to comment
									</strong>
									<p className="muted fs-7">
										User can comment on post when you enable this option.
									</p>
								</div>

								<div style={{ marginLeft: "6px" }}>
									<Switch
										onChange={(checked) =>
											setFieldValue("allowComment", checked)
										}
										checked={values.allowComment}
										uncheckedIcon={false}
										checkedIcon={false}
										onColor="#386cbb"
									/>
								</div>
							</div>
						)}

						{groupChat.comment.isVisibleToUsers && (
							<div className="d-flex align-items-center justify-content-between">
								<div>
									<strong
										style={{
											fontSize: "0.9rem",
										}}
										className="custom-black"
									>
										Allow user to view comment
									</strong>
									<p className="muted fs-7">
										User can view comment when you enable this option.
									</p>
								</div>

								<div style={{ marginLeft: "6px" }}>
									<Switch
										onChange={(checked) =>
											setFieldValue("canUserViewComment", checked)
										}
										checked={values.canUserViewComment}
										uncheckedIcon={false}
										checkedIcon={false}
										onColor="#386cbb"
									/>
								</div>
							</div>
						)}

						<div className="d-flex flex-column gap-2">
							<Button
								color="primary"
								className="w-100"
								disabled={isSubmitting || !isValid || !dirty}
							>
								<FaRegEdit className="me-2" />

								<strong>Update Group</strong>
							</Button>
							<Button
								color="primary"
								className="w-100"
								outline
								type="button"
								onClick={() => {
									setIsCreateGroupFormOpen(false);
									setIsGroupSettingBoxOpen(true);
								}}
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

export default UpdateGroup;
