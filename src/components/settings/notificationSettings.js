import { useEffect } from "react";

import { IoIosArrowBack } from "react-icons/io";

import useChatStore from "../../stores/chatStore";
import {
  useGetNotificationSettings,
  useUpdateNotificationSettings,
} from "./hooks";
import SettingToggle from "./settingToggle";
import { Button } from "reactstrap";

import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { setMessageBox, setMessageTxt } from "../../redux";

const notificationSettings = {
  muteAll: false,
  muteChatPushNotif: false,
  muteGroupPushNotif: false,
  muteNoticePushNotif: false,
};

const NotificationSettings = ({
  showNotice,
  showGroupChat,
  showPrivateChat,
}) => {
  const { notificationSettingsData, isLoading } = useGetNotificationSettings();

  const { mutateAsync, isLoading: isLoadingNotifications } =
    useUpdateNotificationSettings();

  const { setShowNotificationSettings } = useChatStore((store) => store);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: notificationSettings,
    onSubmit: (values) => {
      mutateAsync({
        ...values,
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
      if (notificationSettingsData)
        await formik.setValues(notificationSettingsData, false);
      if (
        notificationSettingsData.muteChatPushNotif &&
        notificationSettingsData.muteGroupPushNotif &&
        notificationSettingsData.muteNoticePushNotif
      )
        await formik.setFieldValue("muteAll", true);
    }

    setInitialValues();

  }, [notificationSettingsData]);

  console.log("formik values", formik.values);

  useEffect(() => {
    if (
      formik.values.muteChatPushNotif &&
      formik.values.muteGroupPushNotif &&
      formik.values.muteNoticePushNotif
    ) {
      formik.setFieldValue("muteAll", true);
    } else {
      formik.setFieldValue("muteAll", false);
    }
  }, [
    formik?.values?.muteChatPushNotif,
    formik?.values?.muteGroupPushNotif,
    formik?.values?.muteNoticePushNotif,
  ]);

  function muteAllHandler(checked) {
    formik.setFieldValue("muteAll", checked);
    formik.setFieldValue("muteChatPushNotif", checked);
    formik.setFieldValue("muteGroupPushNotif", checked);
    formik.setFieldValue("muteNoticePushNotif", checked);
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="white-bg">
        <div className="px-3 py-2">
          <button
            className="back-btn"
            onClick={() => {
              setShowNotificationSettings(false);
            }}
          >
            <IoIosArrowBack />
            <span className="back-text">Back</span>
          </button>
        </div>

        <div
          style={{
            height: "calc(100vh - 290px)",
            overflowY: "auto",
            padding: "0 0.9rem",
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              Loading ...
            </div>
          ) : (
            <>
              {showNotice && showGroupChat && showPrivateChat ? (
                <SettingToggle
                  value={formik.values.muteAll}
                  setFieldValue={formik.setFieldValue}
                  name="muteAll"
                  muteAllHandler={muteAllHandler}
                  label="Mute all notifications"
                  description="Enabling this will mute notifications from private chat, group chat, notices"
                />
              ) : null}

              {showPrivateChat ? (
                <SettingToggle
                  // disabled={formik.values.muteAll}
                  value={formik.values.muteChatPushNotif}
                  setFieldValue={formik.setFieldValue}
                  name="muteChatPushNotif"
                  label="Mute private chat"
                  description="Enabling this will mute notifications from private chat"
                />
              ) : null}

              {showGroupChat ? (
                <SettingToggle
                  // disabled={formik.values.muteAll}
                  value={formik.values.muteGroupPushNotif}
                  setFieldValue={formik.setFieldValue}
                  name="muteGroupPushNotif"
                  label="Mute group chat"
                  description="Enabling this will mute notifications from group chat"
                />
              ) : null}

              {showNotice ? (
                <SettingToggle
                  // disabled={formik.values.muteAll}
                  value={formik.values.muteNoticePushNotif}
                  setFieldValue={formik.setFieldValue}
                  name="muteNoticePushNotif"
                  label="Mute notices"
                  description="Enabling this will mute notifications from notices"
                />
              ) : null}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  // padding: "1rem 1rem 0 1rem",
                }}
              >
                <Button
                  disabled={isLoading}
                  className="w-100"
                  color="primary"
                  type="submit"
                >
                  {isLoading ? "Submitting" : "Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default NotificationSettings;
