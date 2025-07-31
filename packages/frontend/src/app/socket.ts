import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL, {
  withCredentials: true,
});
console.log('✅ Socket connected:',socket);

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

export default socket;
