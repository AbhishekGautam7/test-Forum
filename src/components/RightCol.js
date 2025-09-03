import React from "react";
import { useDispatch } from "react-redux";
import { setSearchBoxStatus } from "../redux";
import PublicCommunity from "./PublicCommunity";

function RightCol(props) {
	const dispatch = useDispatch();

	const hidePop = () => {
		dispatch(setSearchBoxStatus(false));
	};

	return (
		<div
			className="col-xs-12 col-lg-12 col-xl-3 rightCol"
			onClick={() => hidePop()}
		>
			<PublicCommunity role={props.role} />
		</div>
	);
}

export default React.memo(RightCol);
