import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfirmMessageBox, setModal } from "../../redux";
function ConfirmBox(props) {
	const messageBox = useSelector((state) => state.confirmBox);
	console.log(messageBox);
	const dispatch = useDispatch();

	const closeBox = () => {
		props.onNo();
		dispatch(setModal(false));
	};

	const doYes = () => {
		dispatch(setConfirmMessageBox(false));
		dispatch(setModal(false));
		props.onYes();
	};
	return (
		<>
			<div
				className="modal common-community-modal show confirmBox"
				tabIndex="-1"
				aria-labelledby="createCommunityModalLabel"
				aria-hidden="true"
				style={{
					display: "block",
					// zIndex: "99999999",
					// background: "rgba(0,0,0,0.8)",
				}}
				onClick={closeBox}
			>
				<div className=" modal-dialog create-modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button
								onClick={closeBox}
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							{/* <p>{messageBox.message}</p> */}
							<p
								dangerouslySetInnerHTML={{ __html: `${messageBox.message}` }}
							/>
						</div>
						<div className="modal-btn-footer">
							<button className="common-community-btn" onClick={() => doYes()}>
								Yes
							</button>
							<button onClick={closeBox} className="cancel common-btn">
								No
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* {JSON.stringify(props.feed)} */}
		</>
	);
}

export default React.memo(ConfirmBox);
