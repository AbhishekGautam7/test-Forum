import ContentLoader from "react-content-loader";

const SingleNoticePlaceHolder = () => {
	return (
		<div className="white-bg mb-3 p-2 w-100">
			<ContentLoader
				speed={2}
				width="100%"
				height="430px"
				backgroundColor="#f3f3f3"
				foregroundColor="#ecebeb"
			>
				<circle cx="30" cy="28" r="20" />
				<rect x="60" y="24" rx="2" ry="2" width="140" height="10" />
				<rect x="210" y="24" rx="2" ry="2" width="100" height="10" />
				<rect x="10" y="55" rx="10" ry="10" width="97%" height="100" />
				<rect x="1%" y="160" rx="10" ry="10" width="47%" height="30" />
				<rect x="49%" y="160" rx="10" ry="10" width="49%" height="30" />
				<circle cx="25" cy="210" r="15" />
				<rect x="50" y="205" rx="2" ry="2" width="140" height="10" />
				<rect x="210" y="205" rx="2" ry="2" width="80" height="10" />
				<rect x="11" y="230" rx="2" ry="2" width="97%" height="10" />
				<circle cx="25" cy="260" r="15" />
				<rect x="50" y="255" rx="2" ry="2" width="140" height="10" />
				<rect x="210" y="255" rx="2" ry="2" width="80" height="10" />
				<rect x="11" y="280" rx="2" ry="2" width="97%" height="10" />
				<circle cx="25" cy="310" r="15" />
				<rect x="50" y="305" rx="2" ry="2" width="140" height="10" />
				<rect x="210" y="305" rx="2" ry="2" width="80" height="10" />
				<rect x="14" y="330" rx="2" ry="2" width="97%" height="10" />
				<rect x="1%" y="350" rx="10" ry="10" width="90%" height="30" />
				<rect x="92%" y="350" rx="10" ry="10" width="7%" height="30" />
				<rect x="1%" y="390" rx="10" ry="10" width="98%" height="30" />
			</ContentLoader>
		</div>
	);
};

export default SingleNoticePlaceHolder;
