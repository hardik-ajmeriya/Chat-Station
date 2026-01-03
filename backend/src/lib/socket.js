import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { Socket } from "dgram";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import user from "../models/User.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "https://chat-station-beige.vercel.app",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      try {
        // Allow same-origin or server-side connections (no origin)
        if (!origin) return callback(null, true);

        // Strict allowlist check
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Optionally allow any Vercel preview domain
        const isVercel = origin.endsWith(".vercel.app") && origin.startsWith("https://");
        if (isVercel) return callback(null, true);

        return callback(new Error("Not allowed by Socket.IO CORS"));
      } catch {
        return callback(new Error("Socket.IO CORS evaluation failed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];

}

// this is storing for online users
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
  });
});

export { io, app, server };