console.log("ver:1.0");
export const shortQuestionContent = (content) => {
	try {
		console.log(content);
		let ele = document.createElement("div");
		ele.innerHTML = content;
		return ele.textContent.slice(0, 50) + "...";
	} catch (error) {
		console.error(error);
	}
};

export const getStatus = (obj) => {
	let status = "";
	if (obj.userRole === "user") {
		if (obj.page === "home" || obj.page === "search") {
			if (obj && obj.feed && obj.feed.deleted && obj.feed.deleted === true) {
				status = "deleted";
			} else {
				status = "live";
			}
		} else if (obj.page === "eachcommunity") {
			if (obj.communityHeaderTab === "conversations") {
				status = "live";
			} else {
				if (obj.communityHeaderTab === "past") {
					status = "ended";
				} else {
					status = obj.communityHeaderTab;
				}
			}
		}
	} else if (obj.userRole === "admin") {
		if (obj.page === "home" || obj.page === "search") {
			if (obj && obj.feed && obj.feed.deleted && obj.feed.deleted === true) {
				status = "deleted";
			} else {
				status = obj?.feed?.status?.toLowerCase() ?? false;
			}
		} else if (obj.page === "eachcommunity") {
			if (obj.communityHeaderTab === "conversations") {
				status = "live";
			} else {
				if (obj.communityHeaderTab === "past") {
					status = "ended";
				} else {
					status = obj.communityHeaderTab;
				}
			}
		}
	}
	return status;
};
