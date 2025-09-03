import React, { useRef } from "react";
import useIntersectionObserver from "../hooks/useIntersection";

const InfiniteScroller = ({ children, hasMore, loadMore, ...otherProps }) => {
	const ref = useRef();
	useIntersectionObserver({
		onIntersect: loadMore,
		enabled: hasMore,
		target: ref,
	});
	return (
		<div {...otherProps}>
			{children}
			{hasMore && (
				<div
					className="d-flex justify-content-center w-100"
					style={{ padding: "20px", visibility: "none" }}
					ref={ref}
					id="lala"
				>
					<span>Loading...</span>
				</div>
			)}
		</div>
	);
};

export default InfiniteScroller;
