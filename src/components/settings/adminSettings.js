import { useEffect } from "react";

import SettingToggle from "./settingToggle";

import { useFormik } from "formik";

import { Button } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../redux/index";
import { useModifyChatSettings } from "./hooks";

let adminSettings = {
  isChatEnabled: false,

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
  minorSetting: {
    allowMinorsInGroup: false,
    allowMinorsToViewNotices: false,
    allowUsersToChatWithMinors: false,
  },
  canLearnerCreateCommunity: { type: Boolean, default: true },
  canLearnerPostWithinCommunity: { type: Boolean, default: true },
};

const AdminSettings = ({ setChatSettingsData, orgAdminSetting }) => {
  const communityId = useSelector(
    (state) => state?.currentCommunity?.data?._id
  );
  const appId = useSelector((state) => state.info.appId);
  const token = useSelector((state) => state.info.token);

  const { isLoading, mutateAsync } = useModifyChatSettings({
    chatSettingType: "admin",
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
      if (orgAdminSetting) await formik.setValues(orgAdminSetting, false);
    }
    setInitialValues();

  }, [orgAdminSetting]);

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
            value={formik.values.isChatEnabled}
            setFieldValue={formik.setFieldValue}
            name="isChatEnabled"
            label="enable chat"
            description="Enabling this will enable chats"
          />
          {formik.values.isChatEnabled && (
            <div>
              <SettingToggle
                value={formik.values.notice.isEnabled}
                setFieldValue={formik.setFieldValue}
                name="notice.isEnabled"
                label="enable notice"
                description="Enabling this will enable notice"
              />

              {formik.values.notice.isEnabled && (
                <div
                  style={{
                    margin: "0.1rem 0",
                    marginLeft: "0.5rem",
                    borderLeft: "1px solid",
                  }}
                >
                  <SettingToggle
                    value={formik.values.notice.canUserSendNotice}
                    setFieldValue={formik.setFieldValue}
                    name="notice.canUserSendNotice"
                    label="Allow user to send notice"
                    description="Enabling this will allow user to send notice"
                    className="pl-24"
                  />
                  <SettingToggle
                    value={formik.values.notice.comment.isEnabled}
                    setFieldValue={formik.setFieldValue}
                    name="notice.comment.isEnabled"
                    label="Allow comment on notice"
                    description="Enabling this will allow user to comment on notice"
                    className="pl-24"
                  />
                  {formik.values.notice.comment.isEnabled && (
                    <div
                      style={{
                        margin: "0.2rem 0",
                        marginLeft: "1.6rem",
                        borderLeft: "1px solid",
                      }}
                    >
                      <SettingToggle
                        value={
                          formik.values.notice.comment.isVisibleToCommunityAdmin
                        }
                        className="pl-24"
                        setFieldValue={formik.setFieldValue}
                        name="notice.comment.isVisibleToCommunityAdmin"
                        label="Show notice comment to community admin"
                        description="Enabling this will make notice comment visible to community admin"
                      />
                      <SettingToggle
                        className="pl-24"
                        value={formik.values.notice.comment.isVisibleToUsers}
                        setFieldValue={formik.setFieldValue}
                        name="notice.comment.isVisibleToUsers"
                        label="Show notice comment to users"
                        description="Enabling this will make notice comment visible to users"
                      />
                    </div>
                  )}

                  <SettingToggle
                    value={formik.values.notice.reaction.isEnabled}
                    className="pl-24"
                    setFieldValue={formik.setFieldValue}
                    name="notice.reaction.isEnabled"
                    label="Allow user to react on notice"
                    description="Enabling this will allow user to react on notice"
                  />
                  {formik.values.notice.reaction.isEnabled && (
                    <div
                      style={{
                        margin: "0.2rem 0",
                        marginLeft: "1.6rem",
                        borderLeft: "1px solid",
                      }}
                    >
                      <SettingToggle
                        value={
                          formik.values.notice.reaction
                            .isVisibleToCommunityAdmin
                        }
                        className="pl-24"
                        setFieldValue={formik.setFieldValue}
                        name="notice.reaction.isVisibleToCommunityAdmin"
                        label="Show notice reactions to community admin"
                        description="Enabling this will make notice reactions visible to community admin"
                      />
                      <SettingToggle
                        className="pl-24"
                        value={formik.values.notice.reaction.isVisibleToUsers}
                        setFieldValue={formik.setFieldValue}
                        name="notice.reaction.isVisibleToUsers"
                        label="Show notice reactions to users"
                        description="Enabling this will make notice reactions visible to users"
                      />
                    </div>
                  )}
                </div>
              )}
              <SettingToggle
                value={formik.values.groupChat.isEnabled}
                setFieldValue={formik.setFieldValue}
                name="groupChat.isEnabled"
                label="enable group chat"
                description="Enabling this will enable group chat"
              />

              {formik.values.groupChat.isEnabled && (
                <div
                  style={{
                    margin: "0.1rem 0",
                    marginLeft: "0.5rem",
                    borderLeft: "1px solid",
                  }}
                >
                  <SettingToggle
                    value={formik.values.groupChat.canCreateGroup}
                    setFieldValue={formik.setFieldValue}
                    className="pl-24"
                    name="groupChat.canCreateGroup"
                    label="Allow user to create group"
                    description="Enabling this will allow user to create group"
                  />
                  <SettingToggle
                    value={formik.values.groupChat.comment.isEnabled}
                    className="pl-24"
                    setFieldValue={formik.setFieldValue}
                    name="groupChat.comment.isEnabled"
                    label="Allow comment on group chat"
                    description="Enabling this will allow user to comment on group chat"
                  />
                  {formik.values.groupChat.comment.isEnabled && (
                    <div
                      style={{
                        margin: "0.2rem 0",
                        marginLeft: "1.6rem",
                        borderLeft: "1px solid",
                      }}
                    >
                      <SettingToggle
                        value={formik.values.groupChat.comment.isVisibleToUsers}
                        setFieldValue={formik.setFieldValue}
                        className="pl-24"
                        name="groupChat.comment.isVisibleToUsers"
                        label="Show group chat comment to users"
                        description="Enabling this will make group chat comment visible to users"
                      />
                    </div>
                  )}

                  <SettingToggle
                    value={formik.values.groupChat.reaction.isEnabled}
                    setFieldValue={formik.setFieldValue}
                    name="groupChat.reaction.isEnabled"
                    label="Allow user to react on group chat"
                    className="pl-24"
                    description="Enabling this will allow user to react on group chat"
                  />
                  {formik.values.groupChat.reaction.isEnabled && (
                    <div
                      style={{
                        margin: "0.2rem 0",
                        marginLeft: "1.6rem",
                        borderLeft: "1px solid",
                      }}
                    >
                      <SettingToggle
                        className="pl-24"
                        value={
                          formik.values.groupChat.reaction.isVisibleToUsers
                        }
                        setFieldValue={formik.setFieldValue}
                        name="groupChat.reaction.isVisibleToUsers"
                        label="Show group chat reactions to users"
                        description="Enabling this will make group chat reactions visible to users"
                      />
                    </div>
                  )}
                </div>
              )}

              <SettingToggle
                value={formik.values.privateChat.isEnabled}
                setFieldValue={formik.setFieldValue}
                name="privateChat.isEnabled"
                label="enable private chat"
                description="Enabling this will enable private chat"
              />

              {formik.values.privateChat.isEnabled && (
                <div
                  style={{
                    margin: "0.1rem 0",
                    marginLeft: "0.5rem",
                    borderLeft: "1px solid",
                  }}
                >
                  {/* <SettingToggle
                    className="pl-24"
                    value={formik.values.privateChat.isEnabledForUsers}
                    setFieldValue={formik.setFieldValue}
                    name="privateChat.isEnabledForUsers"
                    label="Enable private chat for users"
                    description="Enabling this will allow private chat to users"
                  /> */}
                  <SettingToggle
                    className="pl-24"
                    value={formik.values.privateChat.comment.isEnabled}
                    setFieldValue={formik.setFieldValue}
                    name="privateChat.comment.isEnabled"
                    label="Allow user to comment on private chat"
                    description="Enabling this will allow user to comment on private chat"
                  />

                  <SettingToggle
                    className="pl-24"
                    value={formik.values.privateChat.reaction.isEnabled}
                    setFieldValue={formik.setFieldValue}
                    name="privateChat.reaction.isEnabled"
                    label="Allow user to react on private chat"
                    description="Enabling this will allow user to react on private chat"
                  />
                </div>
              )}

              <div className="group-setting-item-container">
                <div className="d-flex flex-column group-setting-item">
                  <strong>Minor Settings</strong>
                  <small>Prevents you from being added in any groups</small>
                </div>
              </div>

              <div
                style={{
                  margin: "0.1rem 0",
                  marginLeft: "0.5rem",
                  borderLeft: "1px solid",
                }}
              >
                <SettingToggle
                  className="pl-24"
                  value={formik.values.minorSetting.allowUsersToChatWithMinors}
                  setFieldValue={formik.setFieldValue}
                  name="minorSetting.allowUsersToChatWithMinors"
                  label="Allow Users to Start Chat with Minors"
                  description="Enabling this will allow user to chat with minors"
                />

                <SettingToggle
                  className="pl-24"
                  value={formik.values.minorSetting.allowMinorsInGroup}
                  setFieldValue={formik.setFieldValue}
                  name="minorSetting.allowMinorsInGroup"
                  label="Allow Minors in Groups"
                  description="Enabling this will allow minors to be added to groups"
                />

                <SettingToggle
                  className="pl-24"
                  value={formik.values.minorSetting.allowMinorsToViewNotices}
                  setFieldValue={formik.setFieldValue}
                  name="minorSetting.allowMinorsToViewNotices"
                  label="Allow Minors to see notices"
                  description="Enabling this will allow minors to be see notices"
                />
              </div>
            </div>
          )}
          <SettingToggle
            value={formik.values.canLearnerCreateCommunity}
            setFieldValue={formik.setFieldValue}
            name="canLearnerCreateCommunity"
            label="Can Learner Create Community"
            description="Enabling this will allow learner to create community"
          />
          <SettingToggle
            value={formik.values.canLearnerPostWithinCommunity}
            setFieldValue={formik.setFieldValue}
            name="canLearnerPostWithinCommunity"
            label="Can Learner Post Within Community"
            description="Enabling this will allow learner to post within community"
          />
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

export default AdminSettings;
