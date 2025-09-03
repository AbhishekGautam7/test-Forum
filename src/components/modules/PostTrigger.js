import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPost } from "../../redux";
function PostTrigger(props) {
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const dispatch = useDispatch();
  const toggleStatus = ()=>{
    setDropDownStatus(()=>!dropDownStatus);
  }
  return (
    <>
      <button
        className="dropdown-toggle linkBtn"
        href="#"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={() => toggleStatus()}
      >
        <img
          src={process.env.REACT_APP_SITE_URL + `icon-blue-${props.active}.svg`}
          alt="icon"
          loading="lazy"
        />
      </button>
      {dropDownStatus && (
        <ul className="dropdown-menu show">
          <li>
            <button
              className={props.active === "comment" ? "linkBtn active" : "linkBtn"}
              
              onClick={() => dispatch(setPost("discussion"))}
            >
              <img
                src={
                  props.active === "comment"
                    ? process.env.REACT_APP_SITE_URL + "icon-blue-comment.svg"
                    : process.env.REACT_APP_SITE_URL + "icon-black-comment.svg"
                }
                alt="icon"
                loading="lazy"
              />
              Discussion
            </button>
          </li>
          <li>
            <button
              className={props.active === "question" ? "linkBtn active" : "linkBtn"}
              
              onClick={() => dispatch(setPost("question"))}
            >
              <img
                src={
                  props.active == "question"
                    ? process.env.REACT_APP_SITE_URL + "icon-blue-question.svg"
                    : process.env.REACT_APP_SITE_URL + "icon-black-question.svg"
                }
                alt="icon"
                loading="lazy"
              />
              Question
            </button>
          </li>
          
        </ul>
      )}
    </>
  );
}
export default React.memo(PostTrigger);
