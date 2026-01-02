import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // 🔥 FORCE LOCAL
  withCredentials: true,
});
