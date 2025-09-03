import React, { useEffect, useState } from "react";

function AddCommunityDescBox(props) {
	const [desc, setDesc] = useState("");
	const { mode, description } = props;
	useEffect(() => {
		console.log(description);
		setDesc(description);
	}, []);
	return (
		<>
			<div
				className="modal common-community-modal"
				style={{ display: "block" }}
			>
				<div className="modal-dialog add-information-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button
								type="button"
								onClick={() => props.onCancel()}
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>

						<h5 className="modal-title" id="addInformationModalLabel">
							{mode === "edit" ? "Edit" : "Add"} Information
						</h5>
						<div className="line"></div>
						<div className="mb-3">
							<label htmlFor="communityInfo" className="form-label">
								Info
							</label>
							<textarea
								className="form-control"
								id="communityInfo"
								rows="5"
								placeholder=""
								onChange={(e) => setDesc(e.target.value)}
								value={desc}
							></textarea>
						</div>
						<div className="modal-btn-footer">
							<button
								className="common-community-btn"
								disabled={desc.trim().length == 0}
								onClick={() => props.onSetCommunityDesc(desc)}
							>
								{mode === "edit" ? "Edit" : "Add"} information
							</button>
							<button className="common-btn" onClick={() => props.onCancel()}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"></div>
		</>
	);
}
export default React.memo(AddCommunityDescBox);
