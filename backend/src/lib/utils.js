import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set!");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = ENV.NODE_ENV !== "development";
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true,
    // Cross-site cookie for prod (frontend on different origin like Vercel)
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });

  return token;
};

// http://localhost
// https://domain.com
