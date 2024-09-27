import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const WEBSOCKET_PORT = 3001;
httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket server listening on port ${WEBSOCKET_PORT}`);
});

export { io };
