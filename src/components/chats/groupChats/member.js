import { Field } from "formik";
import { Input } from "reactstrap";
import { Avatar } from "../../modules";
import ChatStatus from "./chatStatus";

const MyInput = ({ field, form, ...props }) => {
	return (
		<Input
			{...field}
			{...props}
			onChange={(e) => {
				const prevValues = form.values.members;

				if (e.target.checked) {
					const newArray = [...prevValues, field.value];
					form.setFieldValue("members", [...new Set(newArray)]);
				} else {
					form.setFieldValue(
						"members",
						prevValues.filter((value) => value !== field.value)
					);
				}
			}}
		/>
	);
};

const Member = ({ member, groupInfo, isAddOrRemoveGroupMembersBoxOpen }) => {
	const name = member?.detail?.firstName + " " + member?.detail?.lastName;

	const showCheckBox = isAddOrRemoveGroupMembersBoxOpen
		? groupInfo?.overAllSetting?.canEditSetting
		: true;

	return (
		<div className="d-flex align-items-center gap-2 chat-member ">
			{showCheckBox && (
				<div>
					<Field
						type="checkbox"
						name="members"
						value={member.userId}
						component={MyInput}
					/>
				</div>
			)}
			<div>
				<Avatar
					alt="member"
					src={member?.detail?.profilePic}
					size="40px"
					fullName={member?.detail?.firstName + " " + member?.detail?.lastName}
					initialsFontSize="14px"
				/>
			</div>
			<div
				className="d-flex flex-column"
				style={{
					textOverflow: "ellipsis",
					overflow: "hidden",
					whiteSpace: "nowrap",
				}}
			>
				<strong
					className="custom-black text-capitalize"
					style={{
						textOverflow: "ellipsis",
						overflow: "hidden",
						whiteSpace: "nowrap",
					}}
				>
					{name}
				</strong>
				<small className="small-txt text-muted">
					<ChatStatus chatStatus={member} />
				</small>
			</div>
		</div>
	);
};

export default Member;
