import { io } from "socket.io-client";

import store from "../store/store";

const socket = io(process.env.REACT_APP_BACKEND_SOCKET_PORT, { autoConnect: false });

// Fires on every connect, including automatic reconnects — room membership
// doesn't survive a dropped connection, so this must re-run each time, not
// just once at login.
socket.on("connect", () => {
  const token = store.getState().auth.accessToken;
  if (token) socket.emit("register", token);
});

export default socket;
