import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import App from "./App";

// ---- Web Component Definition ----
const CommunityForumElement = reactToWebComponent(App, React, ReactDOM);
customElements.define("community-forum", CommunityForumElement);

// ---- Optional: Mount React normally for dev/debug ----
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}
