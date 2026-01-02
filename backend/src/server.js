import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = ENV.PORT || 3000;

// middlewares
app.set("trust proxy", true);
app.use(express.json());
// Allow specific origins with credentials; avoid wildcard with credentials
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "https://chat-station-beige.vercel.app",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/mobile
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight for all routes
app.options("*", cors(corsOptions));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Do not serve frontend; backend is API-only for separate deployment

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
