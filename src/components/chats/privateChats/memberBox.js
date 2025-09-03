import Avatar from "../../modules/Avatar";

export const MemberBox = ({ member }) => {
  return (
    <div
      style={{
        cursor: "pointer",
      }}
      className="mb-2 mt-2 d-flex align-items-center gap-3 member-box"
    >
      <Avatar
        fullName={member?.firstName + " " + member?.lastName}
        initialsFontSize="12px"
        alt="member"
        size="30px"
        src={member?.profilePic}
        key={member?._id}
      />
      <strong className="text-capitalize">
        {member?.firstName + " " + member?.lastName}
      </strong>
    </div>
  );
};
