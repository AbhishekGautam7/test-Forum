import React from "react";
import { useSelector } from "react-redux";
function Users(props) {
  const { id } = props;
  const feed = useSelector((state) => state.feeds.data.find(item=>item._id===id));

  return (
    <>     
      <div className="posting-add-people">     
        {feed?.contents?.usersDetails && feed.contents.usersDetails.map((item) => {
            return item && (
              <div className="select-member-badge" key={item._id}>
                <div className="text-wrap">
                  <span>
                   
                    {item && item.firstName ? item.firstName : ""}
                    {item && item.lastName ? item.lastName : ""}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
export default Users;
