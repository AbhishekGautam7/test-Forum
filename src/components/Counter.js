import React from "react";
import UpdatedComponent from "./hoc";
function Counter (props) {
    
    return <div><h3>{props.name}</h3><button>Enter</button></div>
}

export default UpdatedComponent(Counter);