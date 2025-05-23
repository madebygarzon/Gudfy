import { Server } from "socket.io";
import { createServer } from "https";
import express from "express";
import fs from "fs";

const app = express();
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/gudfyp2p.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/gudfyp2p.com/fullchain.pem"),
};

const httpServer = createServer(options, app);

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
  
});

export { io };
