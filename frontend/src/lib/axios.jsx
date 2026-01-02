import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://chat-station.onrender.com/api"; // 👈 Render backend URL

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
