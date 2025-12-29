import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Do not serve frontend; backend is API-only for separate deployment

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});