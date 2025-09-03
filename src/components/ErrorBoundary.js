import React from "react";
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		console.log("error", error, "errorInfo", errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div
					style={{
						display: "flex",
						width: "100%",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
						flexDirection: "column",
					}}
				>
					<img
						src="https://video-communication.s3.eu-west-1.amazonaws.com/1706079306783-5bbc832e243ec209Free%20Broken%20Robot%20Vector.png"
						alt="error"
						style={{
							height: "10rem",
						}}
					/>
					<h4
						style={{
							fontSize: "0.9rem",
						}}
					>
						Uh oh... There's a problem. Try refreshing the app.
					</h4>
					<p
						style={{
							color: "red",
							fontSize: "0.8rem",
							wordBreak: "break-all",
							padding: "0 1rem",
						}}
					>
						{this.state.error?.message}
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}
export default ErrorBoundary;
