"use client";
// stores/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  roles: "",
  permissions: [],
  isLogin: false,
  isLoading: true, // <-- THÊM DÒNG NÀY: Ban đầu, ta luôn ở trạng thái loading

  setUser: (user) =>
    set({
      user,
      isLogin: !!user,
      roles: user?.roles || "",
      isLoading: false, // <-- THÊM DÒNG NÀY: Đặt loading = false khi có user
    }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      user: null,
      roles: [],
      permissions: [],
      isLogin: false,
      isLoading: false, // <-- THÊM DÒNG NÀY: Đặt loading = false khi logout
    });
  },
  setPermissions: (permissions) => {
    set({
      permissions: permissions || [],
    });
  },
}));
