import { io } from "socket.io-client";
var options = {
  rememberUpgrade: true,
  transports: ["websocket"],
  secure: true,
  rejectUnauthorized: false,
};
const socket = io("http://localhost:8081", options);
export default socket;
