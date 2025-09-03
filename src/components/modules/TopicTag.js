import React from "react";
function TopicTag(props) {
  const { topics } = props;
  return (
    <div className="posting-add-topic">
      <div className="add-people-icon" >
        <img
          src={process.env.REACT_APP_SITE_URL + "icon-community-topic.svg"}
          alt="icon"
          loading="lazy"
        />
      </div>
      {/* onClick={() => props.onRemoveTopic(item)} */}
      {topics &&
        topics.length > 0 &&
        topics.map((item) => {
          return (
            <div className="select-member-badge" key={item}>
              <div className="text-wrap">
                <span>#{item}</span>
              </div>
              <button
                className="select-close-icon"
                onClick={() => props.onRemoveTopic(item)}
              >
                <img
                  src={process.env.REACT_APP_SITE_URL + "icon-blue-close.svg"}
                  alt="close-icon"
                />
              </button>
            </div>
          );
        })}

      <div className="select-member-holder">
        <div className="select-member">
          <div className="input-selected-wrap">
            <input
              type="text"
              className="form-control common-form-control"
              placeholder="Add Topic"
              value={props.topicNames}
              onChange={(e) => props.onSetTopics(e)}
            />
          </div>
        </div>

       
      </div>
    </div>
  );
}

export default React.memo(TopicTag);
