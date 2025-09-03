import { useEffect } from "react";

import SettingToggle from "./settingToggle";

import { useFormik } from "formik";

import { Button } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { useModifyChatSettings } from "./hooks";

import { setMessageBox, setMessageTxt } from "../../redux";

let adminSettings = {
	notice: {
		isEnabled: false,
		canUserSendNotice: false,
		comment: {
			isEnabled: false,
			isVisibleToCommunityAdmin: false,
			isVisibleToUsers: false,
		},
		reaction: {
			isEnabled: false,
			isVisibleToCommunityAdmin: false,
			isVisibleToUsers: false,
		},
	},

	groupChat: {
		isEnabled: false,
		canCreateGroup: false,
		comment: {
			isEnabled: false,
			isVisibleToUsers: false,
		},

		reaction: {
			isEnabled: false,
			isVisibleToUsers: false,
		},
	},
	privateChat: {
		isEnabled: false,
		isEnabledForUsers: false,
		comment: {
			isEnabled: false,
		},
		reaction: {
			isEnabled: false,
		},
	},
};

const CommunityAdminSettings = ({ communityAdminSetting, orgAdminSetting }) => {
	const communityId = useSelector(
		(state) => state?.currentCommunity?.data?._id
	);
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);

	const { isLoading, mutateAsync } = useModifyChatSettings({
		chatSettingType: "communityAdmin",
	});

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: adminSettings,
		onSubmit: (values) => {
			mutateAsync({
				...values,
				communityId,
				appId,
				token,
			})
				.then((res) => {
					dispatch(setMessageBox(true));
					dispatch(setMessageTxt("Update successfull"));
				})
				.catch((error) => {
					console.log({ error });
					dispatch(setMessageBox(true));
					dispatch(setMessageTxt("Update unsuccessfull"));
				});
		},
	});

	useEffect(() => {
		async function setInitialValues() {
			if (communityAdminSetting)
				await formik.setValues(communityAdminSetting, false);
		}
		setInitialValues();

	}, [communityAdminSetting]);

	return (
		<div
		// style={{
		//   padding: "2rem 1rem",
		//   overflow: "auto",
		//   height: "calc(100vh - 155px)",
		// }}
		>
			<form onSubmit={formik.handleSubmit}>
				<div
					style={{
						padding: "2rem 1rem",
						overflow: "auto",
						height: "calc(100vh - 350px)",
					}}
				>
					<SettingToggle
						value={orgAdminSetting?.notice?.isEnabled}
						setFieldValue={formik.setFieldValue}
						name="notice.isEnabled"
						label="enable notice"
						description="Enabling this will enable notice"
						disabled={true}
					/>

					{orgAdminSetting?.notice?.isEnabled && (
						<div
							style={{
								margin: "0.1rem 0",
								marginLeft: "0.5rem",
								borderLeft: "1px solid",
							}}
						>
							{orgAdminSetting?.notice?.canUserSendNotice && (
								<SettingToggle
									value={formik.values.notice.canUserSendNotice}
									setFieldValue={formik.setFieldValue}
									name="notice.canUserSendNotice"
									label="Allow user to send notice"
									description="Enabling this will allow user to send notice"
									disabled={!orgAdminSetting.notice.canUserSendNotice}
									className="pl-24"
								/>
							)}

							{orgAdminSetting.notice.comment.isEnabled && (
								<SettingToggle
									value={formik.values.notice.comment.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="notice.comment.isEnabled"
									label="Allow comment on notice"
									description="Enabling this will allow user to comment on notice"
									disabled={!orgAdminSetting.notice.comment.isEnabled}
									className="pl-24"
								/>
							)}

							{formik.values.notice.comment.isEnabled && (
								<div
									style={{
										margin: "0.2rem 0",
										marginLeft: "1.6rem",
										borderLeft: "1px solid",
									}}
								>
									{/* {orgAdminSetting.notice.comment.isVisibleToCommunityAdmin && (
                    <SettingToggle
                      value={
                        formik.values.notice.comment.isVisibleToCommunityAdmin
                      }
                      setFieldValue={formik.setFieldValue}
                      name="notice.comment.isVisibleToCommunityAdmin"
                      label="Show notice comment to community admin"
                      description="Enabling this will make notice comment visible to community admin"
                      disabled={
                        !orgAdminSetting.notice.comment
                          .isVisibleToCommunityAdmin
                      }
                    />
                  )} */}

									{orgAdminSetting.notice.comment.isVisibleToUsers && (
										<SettingToggle
											value={formik.values.notice.comment.isVisibleToUsers}
											setFieldValue={formik.setFieldValue}
											name="notice.comment.isVisibleToUsers"
											label="Show notice comment to users"
											description="Enabling this will make notice comment visible to users"
											disabled={
												!orgAdminSetting.notice.comment.isVisibleToUsers
											}
											className="pl-24"
										/>
									)}
								</div>
							)}

							{orgAdminSetting.notice.reaction.isEnabled && (
								<SettingToggle
									value={formik.values.notice.reaction.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="notice.reaction.isEnabled"
									label="Allow user to react on notice"
									description="Enabling this will allow user to react on notice"
									disabled={!orgAdminSetting.notice.reaction.isEnabled}
									className="pl-24"
								/>
							)}

							{formik.values.notice.reaction.isEnabled && (
								<div
									style={{
										margin: "0.2rem 0",
										marginLeft: "1.6rem",
										borderLeft: "1px solid",
									}}
								>
									{/* {orgAdminSetting.notice.reaction
                    .isVisibleToCommunityAdmin && (
                    <SettingToggle
                      value={
                        formik.values.notice.reaction.isVisibleToCommunityAdmin
                      }
                      setFieldValue={formik.setFieldValue}
                      name="notice.reaction.isVisibleToCommunityAdmin"
                      label="Show notice reactions to community admin"
                      description="Enabling this will make notice reactions visible to community admin"
                      disabled={
                        !orgAdminSetting.notice.reaction
                          .isVisibleToCommunityAdmin
                      }
                    />
                  )} */}
									{orgAdminSetting.notice.reaction.isVisibleToUsers && (
										<SettingToggle
											value={formik.values.notice.reaction.isVisibleToUsers}
											setFieldValue={formik.setFieldValue}
											name="notice.reaction.isVisibleToUsers"
											label="Show notice reactions to users"
											description="Enabling this will make notice reactions visible to users"
											disabled={
												!orgAdminSetting.notice.reaction.isVisibleToUsers
											}
											className="pl-24"
										/>
									)}
								</div>
							)}
						</div>
					)}

					<SettingToggle
						value={orgAdminSetting?.groupChat.isEnabled}
						setFieldValue={formik.setFieldValue}
						name="groupChat.isEnabled"
						label="enable group chat"
						description="Enabling this will enable group chat"
						disabled={true}
					/>

					{orgAdminSetting?.groupChat.isEnabled && (
						<div
							style={{
								margin: "0.1rem 0",
								marginLeft: "0.5rem",
								borderLeft: "1px solid",
							}}
						>
							{orgAdminSetting.groupChat.canCreateGroup && (
								<SettingToggle
									value={formik.values.groupChat.canCreateGroup}
									setFieldValue={formik.setFieldValue}
									name="groupChat.canCreateGroup"
									label="Allow user to create group"
									description="Enabling this will allow user to create group"
									disabled={!orgAdminSetting.groupChat.canCreateGroup}
									className="pl-24"
								/>
							)}

							{orgAdminSetting.groupChat.comment.isEnabled && (
								<SettingToggle
									value={formik.values.groupChat.comment.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="groupChat.comment.isEnabled"
									label="Allow comment on group chat"
									description="Enabling this will allow user to comment on group chat"
									disabled={!orgAdminSetting.groupChat.comment.isEnabled}
									className="pl-24"
								/>
							)}

							{formik.values.notice.comment.isEnabled && (
								<div
									style={{
										margin: "0.2rem 0",
										marginLeft: "1.6rem",
										borderLeft: "1px solid",
									}}
								>
									{orgAdminSetting.groupChat.comment.isVisibleToUsers && (
										<SettingToggle
											value={formik.values.groupChat.comment.isVisibleToUsers}
											setFieldValue={formik.setFieldValue}
											name="groupChat.comment.isVisibleToUsers"
											label="Show group chat comment to users"
											description="Enabling this will make group chat comment visible to users"
											disabled={
												!orgAdminSetting.groupChat.comment.isVisibleToUsers
											}
											className="pl-24"
										/>
									)}
								</div>
							)}

							{orgAdminSetting.groupChat.reaction.isEnabled && (
								<SettingToggle
									value={formik.values.groupChat.reaction.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="groupChat.reaction.isEnabled"
									label="Allow user to react on group chat"
									description="Enabling this will allow user to react on group chat"
									disabled={!orgAdminSetting.groupChat.reaction.isEnabled}
									className="pl-24"
								/>
							)}

							{formik.values.groupChat.reaction.isEnabled && (
								<div
									style={{
										margin: "0.2rem 0",
										marginLeft: "1.6rem",
										borderLeft: "1px solid",
									}}
								>
									{orgAdminSetting.groupChat.reaction.isVisibleToUsers && (
										<SettingToggle
											value={formik.values.groupChat.reaction.isVisibleToUsers}
											setFieldValue={formik.setFieldValue}
											name="groupChat.reaction.isVisibleToUsers"
											label="Show group chat reactions to users"
											description="Enabling this will make group chat reactions visible to users"
											disabled={
												!orgAdminSetting.groupChat.reaction.isVisibleToUsers
											}
											className="pl-24"
										/>
									)}
								</div>
							)}
						</div>
					)}

					<SettingToggle
						value={orgAdminSetting?.privateChat.isEnabled}
						setFieldValue={formik.setFieldValue}
						name="privateChat.isEnabled"
						label="enable private chat"
						disabled={true}
						description="Enabling this will enable private chat"
					/>

					{orgAdminSetting?.privateChat.isEnabled && (
						<div
							style={{
								margin: "0.1rem 0",
								marginLeft: "0.5rem",
								borderLeft: "1px solid",
							}}
						>
							{/* {orgAdminSetting.privateChat.isEnabledForUsers && (
								<SettingToggle
									value={formik.values.privateChat.isEnabledForUsers}
									setFieldValue={formik.setFieldValue}
									name="privateChat.isEnabledForUsers"
									label="Enable private chat for users"
									description="Enabling this will allow private chat to users"
									disabled={!orgAdminSetting.privateChat.isEnabledForUsers}
									className="pl-24"
								/>
							)} */}

							{orgAdminSetting.privateChat.comment.isEnabled && (
								<SettingToggle
									value={formik.values.privateChat.comment.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="privateChat.comment.isEnabled"
									label="Allow user to comment on private chat"
									description="Enabling this will allow user to comment on private chat"
									disabled={!orgAdminSetting.privateChat.comment.isEnabled}
									className="pl-24"
								/>
							)}

							{orgAdminSetting.privateChat.reaction.isEnabled && (
								<SettingToggle
									value={formik.values.privateChat.reaction.isEnabled}
									setFieldValue={formik.setFieldValue}
									name="privateChat.reaction.isEnabled"
									label="Allow user to react on private chat"
									description="Enabling this will allow user to react on private chat"
									disabled={!orgAdminSetting.privateChat.reaction.isEnabled}
									className="pl-24"
								/>
							)}
						</div>
					)}
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						padding: "1rem 1rem 0 1rem",
					}}
				>
					<Button
						disabled={isLoading}
						className="w-100"
						color="primary"
						type="submit"
						// style={{ marginTop: "12px" }}
					>
						{isLoading ? "Submitting" : "Submit"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CommunityAdminSettings;
