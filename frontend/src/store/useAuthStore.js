import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  // 🔹 Check current user (on app load)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", { validateStatus: () => true });
      const isJson = typeof res.data === "object" && res.headers?.["content-type"]?.includes("application/json");
      const validUser = isJson && res.status === 200 && res.data && (res.data._id || res.data.email);
      set({ authUser: validUser ? res.data : null });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 🔹 Signup
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Welcome! Account created successfully 🎉");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 🔹 Login
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials";
      toast.error(message);
    }
  },

  // 🔹 Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    }
  },
}));
