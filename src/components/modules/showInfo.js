import React from "react";
import { useDispatch } from "react-redux";
import { setModal } from "../../redux";

function ShowInfo({ setShowInfo, description }) {
	const dispatch = useDispatch();
	const closeModalBox = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowInfo(false);
		dispatch(setModal(false));
	};
	const workit = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};
	return (
		<>
			<div
				className="modal fade show common-community-modal"
				id="showInfo"
				tabIndex="-1"
				aria-labelledby="inviteModalLabel"
				aria-hidden="true"
				style={{ display: "block" }}
				onClick={closeModalBox}
			>
				<div
					className="modal-dialog add-information-dialog"
					onClick={(e) => workit(e)}
				>
					<div className="modal-content">
						<div className="modal-header">
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={closeModalBox}
							></button>
						</div>

						<h5 className="modal-title" id="inviteModalLabel">
							About
						</h5>
						<span className="show-info">
							{description ? description : "No Description Found"}
						</span>

						{/* <div className="modal-btn-footer">
							<button
								className="common-btn"
								onClick={() => {
									setShowInfo(false);
									dispatch(setModal(false));
								}}
							>
								Cancel
							</button>
						</div> */}
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"></div>
		</>
	);
}

export default React.memo(ShowInfo);
