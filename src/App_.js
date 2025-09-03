import React from "react";

import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./components/ErrorBoundary";
import ReactWebComponent from "react-web-component";

import Site from "./Site";

class App extends React.Component {
	componentDidMount() {
		console.log("componentDidMount :", this.props.name);
	}
	webComponentConnected() {
		console.log("webComponentConnected", this.props);
	}
	webComponentAttributeChanged(name, oldValue, newValue) {
		console.log("webComponentAttributeChanged");
	}
	attributeChangedCallback(name, oldValue, newValue) {
		console.log("attributeChangedCallback");
	}
	webComponentAttached() {
		console.log("webComponentAttached", this.props);
	}
	webComponentDisconnected() {
		console.log("webComponentDisconnected", this.props);
	}
	render() {
		return (
			<Provider store={store}>
				<ErrorBoundary>
					<Site
						userid={this.props.userid}
						clientid={this.props.clientid}
						orgid={this.props.orgid}
						tenentid={this.props.tenentid}
						secretkey={this.props.secretkey}
						appid={this.props.appid}
						token={this.props.token}
					></Site>
				</ErrorBoundary>
			</Provider>
		);
	}
}

ReactWebComponent.create(<App />, "community-forum");
