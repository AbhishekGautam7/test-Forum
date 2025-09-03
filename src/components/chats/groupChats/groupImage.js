import Avatar from "../../modules/Avatar";
import { useIsMobileView } from "../../../hooks/index";

const GroupImage = ({ users, isHeader = false }) => {
  let groupImage;

  const { isMobileView } = useIsMobileView({});

  if (users?.length === 2) {
    groupImage = (
      <div className={isHeader ? "group-header-image" : "group-image"}>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users.slice(0, 1).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              fullName={user?.firstName + " " + user?.lastName}
              borderRadius="0"
              src={user?.profilePic}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "10px") : "10px"
              }
            />
          ))}
        </div>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users?.slice(1, 2).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              borderRadius="0"
              src={user?.profilePic}
              fullName={user?.firstName + " " + user?.lastName}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "10px") : "10px"
              }
            />
          ))}
        </div>
      </div>
    );
  } else if (users?.length === 3) {
    groupImage = (
      <div className={isHeader ? "group-header-image" : "group-image"}>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users?.slice(0, 2).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              borderRadius="0"
              fullName={user?.firstName + " " + user?.lastName}
              src={user?.profilePic}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "9px") : "9px"
              }
            />
          ))}
        </div>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users?.slice(2, 3).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              borderRadius="0"
              src={user?.profilePic}
              fullName={user?.firstName + " " + user?.lastName}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "9px") : "9px"
              }
            />
          ))}
        </div>
      </div>
    );
  } else if (users?.length > 4 || users?.length === 4) {
    groupImage = (
      <div className={isHeader ? "group-header-image" : "group-image"}>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users?.slice(0, 2).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              borderRadius="0"
              src={user?.profilePic}
              fullName={user?.firstName + " " + user?.lastName}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "9px") : "9px"
              }
            />
          ))}
        </div>
        <div
          className={
            isHeader ? "group-header-image-column" : "group-image-column"
          }
        >
          {users?.slice(2, 4).map((user) => (
            <Avatar
              alt="group"
              size="100%"
              key={user?._id}
              borderRadius="0"
              src={user?.profilePic}
              fullName={user?.firstName + " " + user?.lastName}
              initialsFontSize={
                isHeader ? (isMobileView ? "7px" : "9px") : "9px"
              }
            />
          ))}
        </div>
      </div>
    );
  }
  return <div>{groupImage}</div>;
};

export default GroupImage;
