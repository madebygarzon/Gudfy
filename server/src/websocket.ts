import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";
const FRONT_URL = process.env.FRONT_URL || "http://localhost:8000";
const WEBSOCKET_PORT = process.env.PORT_SOKET || 3001;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket server listening on port ${WEBSOCKET_PORT}`);
  console.log(`Allowed origins: ${BACKEND_URL}, ${FRONT_URL}`);
});

export { io };
