import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

const Search = ({ setSearch, activeTab = "" }) => {
	const [searchValue, setSearchValue] = useState("");

	useEffect(() => {
		if (activeTab !== "chats") {
			setSearchValue("");
		}
	}, [activeTab]);

	useEffect(() => {
		let delayDebounceFn;

		if (searchValue || searchValue === "") {
			delayDebounceFn = setTimeout(() => {
				setSearch(searchValue);
			}, 500);
		}

		return () => clearTimeout(delayDebounceFn);
	}, [searchValue, setSearch]);

	function handleChange(event) {
		const newValue = event.target.value;

		setSearchValue(newValue);
	}

	return (
		<div
			style={{
				padding: "0.5rem 1rem",
				width: "100%",
			}}
		>
			<div className="create-group-search-box-wrapper">
				<CiSearch size={15} />
				<input
					placeholder="Search"
					value={searchValue}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default Search;
