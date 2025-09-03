import { INITIALIZE_SOCKET } from "./Types";

export const initializeSocket = (payload) => {
	return {
		type: INITIALIZE_SOCKET,
		payload: payload,
	};
};
