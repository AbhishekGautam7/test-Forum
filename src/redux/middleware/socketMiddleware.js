// socketMiddleware.js
import io from "socket.io-client";
import { initializeSocket } from "../socket/Actions";
import { SET_MY_PROFILE } from "../my_profile/Types";

export const createSocket = (appid, token) => {
	const socket = io(process.env.REACT_APP_API_URL, {
		// auth: { appId, token },
		query: { appid, token },
	});

	socket.on("connect", () => {
		console.log("Socket connected");
	});

	socket.on("disconnect", () => {
		console.log("Socket disconnected");
	});

	return socket;
};

const socketMiddleware = () => (store) => {
	return (next) => (action) => {
		if (action.type === SET_MY_PROFILE) {
			if (store.getState().info.appId && store.getState().info.token) {
				if (store.getState().socket.socket === null) {
					const socket = createSocket(
						store.getState().info.appId,
						store.getState().info.token
					);
					store.dispatch(initializeSocket(socket));
				}
			}
		}

		return next(action);
	};
};

export default socketMiddleware;
