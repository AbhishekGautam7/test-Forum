import { ImInfo } from "react-icons/im";
import { IoIosArrowBack } from "react-icons/io";
import GroupImage from "../groupImage";
import { useIsMobileView } from "../../../../hooks/index";

const GroupDetailHeader = ({
  socket,
  totalOnlineUsers,
  setIsGroupSettingBoxOpen,
  overAllSetting,
  groupInfo,
  setIsGroupDetailBoxOpen,
  setGroupInfo,
}) => {
  const leaveGroup = ({ groupId }) => {
    socket.emit("exitGroup", { groupId });
  };

  const { isMobileView } = useIsMobileView({});
  return (
    <div className="d-flex gap-3 group-detail-header w-100 justify-content-between p-2">
      <div
        className="d-flex gap-3"
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <button
          className="group-detail-header-button"
          onClick={() => {
            // leaveGroup({ groupId: groupInfo?.id });
            setIsGroupDetailBoxOpen(false);
          }}
        >
          <IoIosArrowBack color="white" />
        </button>
        <div
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          className="d-flex gap-2 align-items-center"
        >
          {groupInfo && <GroupImage users={groupInfo?.users} isHeader={true} />}

          <div
            className="d-flex flex-column"
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <strong
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: isMobileView ? "14px" : "",
              }}
            >
              {groupInfo?.name}
            </strong>
            <small
              className="chat-detail-header"
              style={{
                fontSize: isMobileView ? "0.6rem" : "0.635rem",
              }}
            >
              {totalOnlineUsers > 1
                ? `${totalOnlineUsers} online users`
                : `${totalOnlineUsers} online user`}
            </small>
          </div>
        </div>
      </div>
      <button
        className="group-detail-header-button"
        onClick={() => {
          setIsGroupSettingBoxOpen(true);
          setIsGroupDetailBoxOpen(false);
          setGroupInfo((prevInfo) => {
            return {
              ...prevInfo,
              overAllSetting,
            };
          });
        }}
      >
        <ImInfo color="white" />
      </button>
    </div>
  );
};

export default GroupDetailHeader;
