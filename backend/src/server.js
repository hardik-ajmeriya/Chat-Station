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
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Do not serve frontend; backend is API-only for separate deployment

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
