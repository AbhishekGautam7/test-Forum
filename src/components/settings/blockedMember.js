import ChatStatus from "../chats/groupChats/chatStatus";
import Avatar from "../modules/Avatar";
import { useDispatch } from "react-redux";
import { Button } from "reactstrap";

import {
	setConfirmMessageTxt,
	setMessageBox,
	setMessageBoxCloseBtn,
	setMessageTxt,
	setModal,
} from "../../redux";
import useChatStore from "../../stores/chatStore";
import { useBlockUnBlockUser } from "./hooks/useBlockUnBlockUser";

const BlockedMember = ({ member }) => {
	const dispatch = useDispatch();
	const name = member?.firstName + " " + member?.lastName;

	const { setConfirmBoxStatus, setConfirmFunction } = useChatStore(
		(store) => store
	);

	const { isLoading, mutate } = useBlockUnBlockUser();

	const confirmBlockUser = () => {
		try {
			dispatch(
				setConfirmMessageTxt(`Are you sure you want to block  ${name} ?`)
			);
			setConfirmBoxStatus(true);
			dispatch(setModal(true));
			setConfirmFunction(blockUser);
		} catch (error) {
			console.error(error);
		}
	};

	const blockUser = () => {
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt(`blocking ${name}... `));
		dispatch(setMessageBoxCloseBtn(false));
		mutate({
			blockingUserId: member?._id,
			block: true,
		});
		dispatch(setMessageTxt(`Successfully blocked ${name}`));
		dispatch(setMessageBoxCloseBtn(true));
	};

	const unBlockUser = () => {
		dispatch(setConfirmMessageTxt(""));
		setConfirmBoxStatus(false);
		dispatch(setMessageBox(true));
		dispatch(setMessageTxt(`unblocking ${name}... `));

		dispatch(setMessageBoxCloseBtn(false));
		mutate({
			blockingUserId: member?._id,
			block: false,
		});
		dispatch(setMessageTxt(`Successfully unblocked ${name}`));

		dispatch(setMessageBoxCloseBtn(true));
	};
	const confirmUnBlockUser = () => {
		try {
			dispatch(
				setConfirmMessageTxt(`Are you sure you want to unblock ${name} ?`)
			);
			setConfirmBoxStatus(true);
			dispatch(setModal(true));
			setConfirmFunction(unBlockUser);
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div
			className="chat-member "
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<div className="d-flex align-items-center gap-2">
				<Avatar
					alt="member"
					src={member?.profilePic}
					size="40px"
					fullName={name}
					initialsFontSize="14px"
				/>
				<div className="d-flex flex-column">
					<strong
						className="custom-black text-capitalize"
						style={{
							width: "200px",
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

			{member?.isBlocked ? (
				<Button
					size="sm"
					color="success"
					disabled={isLoading}
					onClick={confirmUnBlockUser}
					data-bs-toggle="modal"
					data-bs-target="#inviteModal"
				>
					Unblock
				</Button>
			) : (
				<Button
					size="sm"
					color="danger"
					disabled={isLoading}
					onClick={confirmBlockUser}
					data-bs-toggle="modal"
					data-bs-target="#inviteModal"
				>
					Block
				</Button>
			)}
		</div>
	);
};

export default BlockedMember;
