import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
