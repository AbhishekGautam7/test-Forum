import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessageBox, setModal } from "../../redux";

function MessageBox({ isMobile = false }) {
	const messageBox = useSelector((state) => state.messageBox);
	const dispatch = useDispatch();
	const closeBtnStatus = useSelector(
		(state) => state.messageBox.closeBtnStatus
	);
	const closeBox = () => {
		if (closeBtnStatus === true) {
			dispatch(setMessageBox(false));
			dispatch(setModal(false));
		}
	};
	return (
		<>
			<div
				className="modal common-community-modal show"
				id="messageBox"
				tabIndex="-1"
				aria-labelledby="createCommunityModalLabel"
				aria-hidden="true"
				style={{ display: "block" }}
				onClick={closeBox}
			>
				<div className="modal-dialog create-modal-dialog">
					<div
						className="modal-content"
						style={{ width: isMobile ? "97vw" : "" }}
					>
						<div className="modal-header">
							{closeBtnStatus && (
								<button
									onClick={closeBox}
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								></button>
							)}
						</div>
						<div className="modal-body">
							<p
								dangerouslySetInnerHTML={{ __html: `${messageBox.message}` }}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"></div>
		</>
	);
}

export default React.memo(MessageBox);
