"use client";
// stores/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null, // thông tin cơ bản của user
  roles: "", // danh sách role
  permissions: [], // danh sách quyền
  isLogin: false, // trạng thái login

  setUser: (user) =>
    set({
      user,
      isLogin: !!user,
      roles: user?.roles || "",
    }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      user: null,
      roles: [],
      permissions: [],
      isLogin: false,
    });
  },
  setPermissions: (permissions) => {
    set({
      permissions: permissions || [],
    });
  },
}));
