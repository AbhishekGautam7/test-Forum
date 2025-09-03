import { useState } from "react";

import { IoIosArrowBack } from "react-icons/io";

import InfiniteScroller from "..//chats/modules/infiniteScroller";
import Search from "../modules/Search";
import { FormGroup, Input } from "reactstrap";
import useChatStore from "../../stores/chatStore";
import BlockedMember from "./blockedMember";
import { useGetBlockedUnBlockedUsers } from "./hooks/useGetBlockedUnBlockedUsers";

const BlockedUsers = () => {
	const {
		userList,
		setSearch,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
		setIsBlocked,
	} = useGetBlockedUnBlockedUsers();

	const { setShowBlockedAndUnBlockedUsersList } = useChatStore(
		(store) => store
	);

	const [isAPICall, setStartAPICall] = useState(false);

	const [selectedValue, setSelectedValue] = useState("blocked");

	const renderContent = () => {
		let content = null;
		if (!userList || isLoading || isFetching) {
			content = (
				<small
					style={{
						height: "calc(100vh - 290px)",
					}}
					className="w-100 d-flex justify-content-center align-items-center"
				>
					Loading members...
				</small>
			);
		} else {
			if (userList.length === 0) {
				content = (
					<div
						className="w-100 d-flex justify-content-center align-items-center"
						style={{
							height: "calc(100vh - 290px)",
						}}
					>
						No members found
					</div>
				);
			} else if (userList.length > 0) {
				content = userList.map((member) => (
					<BlockedMember key={member?._id} member={member} />
				));
			}
		}
		return content;
	};

	const handleSelectedValue = (e) => {
		const { value } = e.target;
		setSelectedValue(value);

		if (value === "blocked") {
			setIsBlocked(true);
		} else {
			setIsBlocked(false);
		}
	};

	return (
		<div className="white-bg">
			<div className="px-3 py-2">
				<button
					className="back-btn"
					onClick={() => {
						setShowBlockedAndUnBlockedUsersList(false);
					}}
				>
					<IoIosArrowBack />
					<span className="back-text">Back</span>
				</button>
			</div>
			<div className="d-flex flex-column ">
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
						<option value="blocked">Blocked Users</option>
						<option value="active">Active Users</option>
					</Input>
				</FormGroup>
				<Search setSearch={setSearch} key="userSearch" />
			</div>
			<div
				style={{
					height: "calc(100vh - 290px)",
					overflowY: "auto",
					padding: "0 0.9rem",
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
					{renderContent()}
				</InfiniteScroller>
			</div>
		</div>
	);
};

export default BlockedUsers;
