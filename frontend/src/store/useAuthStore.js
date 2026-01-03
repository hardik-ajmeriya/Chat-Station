import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // 🔹 Check current user (on app load)
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        validateStatus: () => true,
      });
      const isJson =
        typeof res.data === "object" &&
        res.headers?.["content-type"]?.includes("application/json");
      const validUser =
        isJson &&
        res.status === 200 &&
        res.data &&
        (res.data._id || res.data.email);
      set({ authUser: validUser ? res.data : null });
      get().connectSocket()
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
      toast.success("Welcome! Account created successfully");
      get().connectSocket()
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
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket()
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 🔹 Logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out");
      get().disconnectSocket()
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout Error:", error);
    }
  },

  // 🔹 Update Profile (e.g., profile picture)
  updateProfile: async ({ profilePic }) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        profilePic,
      });
      set({ authUser: res.data });
      toast.success("Profile updated");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Update failed";
      toast.error(message);
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    // Require authenticated user and avoid creating multiple socket instances
    if (!authUser || socket) return;

    const s = io(BASE_URL, {
      withCredentials: true, // ensures JWT cookie is sent with the handshake
      autoConnect: true,
    });

    // Save instance immediately to prevent race conditions on rapid calls
    set({ socket: s });

    // Presence updates
    s.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Helpful error logging
    s.on("connect_error", (err) => {
      console.log("Socket connect_error:", err?.message);
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (!socket) return;
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } finally {
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
