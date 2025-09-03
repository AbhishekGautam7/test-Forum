import { useState } from "react";

import { Form, Formik } from "formik";
import { FaRegEdit } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, Input } from "reactstrap";
import * as yup from "yup";
import { setMessageBox, setMessageTxt } from "../../../redux";
import { useGetCommunityUsers } from "../hooks";
import { useAddOrRemoveGroupUsers } from "../hooks/useAddOrRemoveGroupUsers";
import InfiniteScroller from "../modules/infiniteScroller";
import Member from "./member";

const createGroupValidationSchema = yup.object({
	members: yup
		.array()
		.of(yup.string())
		.min(1, "Atleast one member is required")
		.required("Member is required"),
});

const AddOrRemoveGroupUsers = ({
	groupInfo,
	setIsAddOrRemoveGroupMembersBoxOpen,
	setIsGroupSettingBoxOpen,
	isAddOrRemoveGroupMembersBoxOpen,
}) => {
	const appId = useSelector((state) => state.info.appId);
	const token = useSelector((state) => state.info.token);

	const [selectedValue, setSelectedValue] = useState("all");

	const { mutateAsync } = useAddOrRemoveGroupUsers();

	const [isAPICall, setStartAPICall] = useState(false);

	const dispatch = useDispatch();

	const {
		communityUserList,
		setGroupMembersOnly,
		fetchNextPage,
		hasNextPage,
		isLoading,
	} = useGetCommunityUsers({ groupId: groupInfo?.id });

	const initialUserIds = communityUserList
		?.filter((user) => user.isGroupUser)
		?.map((item) => item.userId);

	const handleSubmit = (values) => {
		const newAddedUsers = values.members.filter(
			(userId) => !initialUserIds.includes(userId)
		);
		const removedUsers = initialUserIds.filter(
			(userId) => !values.members.includes(userId)
		);
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt("Updating Group..."));
		mutateAsync({
			appId,
			token,
			newAddedUsers,
			removedUsers,
			groupId: groupInfo.id,
		});
	};

	const handleSelectedValue = (e) => {
		const { value } = e.target;
		setSelectedValue(value);

		if (value === "All") {
			setGroupMembersOnly(null);
		} else if (value === "Group Members") {
			setGroupMembersOnly(true);
		} else {
			setGroupMembersOnly(false);
		}
	};

	return (
		<Formik
			initialValues={{
				members: initialUserIds,
			}}
			validationSchema={createGroupValidationSchema}
			enableReinitialize={true}
			onSubmit={handleSubmit}
		>
			{({ isSubmitting, isValid, dirty, values, setFieldValue, resetForm }) => {
				return (
					<Form className="d-flex flex-column gap-4 white-bg p-4">
						<div className="d-flex flex-column">
							<FormGroup
								className="w-100"
								style={{
									padding: "0.5rem 1rem",
								}}
							>
								<Input
									id="exampleSelect"
									name="select"
									type="select"
									onChange={handleSelectedValue}
									value={selectedValue}
									style={{
										borderRadius: "2px",
										border: "2px solid #bebebe",
										outline: "none",
										padding: "3px",
										height: "27px",
										fontSize: "12px",
									}}
								>
									<option>All</option>
									<option>Group Members</option>
									<option>Non-Members</option>
								</Input>
							</FormGroup>
							{/* <Search /> */}
						</div>
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
								{communityUserList && communityUserList.length > 0 ? (
									communityUserList.map((member) => (
										<Member
											key={member?._id}
											member={member}
											groupInfo={groupInfo}
											isAddOrRemoveGroupMembersBoxOpen={
												isAddOrRemoveGroupMembersBoxOpen
											}
										/>
									))
								) : communityUserList && communityUserList.length === 0 ? (
									<div
										className="w-100 d-flex justify-content-center align-items-center"
										style={{ height: "400px" }}
									>
										No members found
									</div>
								) : isLoading ? (
									<small className="w-100 d-flex justify-content-center align-items-center">
										Loading members...
									</small>
								) : null}
							</InfiniteScroller>
						</div>

						<div className="d-flex flex-column gap-2">
							{groupInfo && groupInfo?.overAllSetting?.canEditSetting && (
								<Button
									color="primary"
									className="w-100"
									disabled={isSubmitting || !isValid || !dirty}
								>
									<FaRegEdit className="me-2" />
									<strong>Update Members</strong>
								</Button>
							)}
							<Button
								color="primary"
								className="w-100"
								outline
								type="button"
								onClick={() => {
									setIsAddOrRemoveGroupMembersBoxOpen(false);
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

export default AddOrRemoveGroupUsers;
