import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "john", id: 123, age: 25 },
  isLoggedIn: false,
  isLoading: false,

  login: () => {
    console.log("We Just LoggedIn");
    set({ isLoggedIn: true, isLoading: true});
  },
}));
