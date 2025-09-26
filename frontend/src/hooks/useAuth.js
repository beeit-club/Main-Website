"use client";
import { authServices } from "@/services/auth";
import { useState } from "react";

const { useAuthStore } = require("@/stores/authStore");
import { toast } from "sonner";
export function useAuthHook() {
  const { user, setUser, logout } = useAuthStore();
  const [logoutLoading, setLogoutLoading] = useState(false);

  // login
  const login = async (payload) => {
    try {
      const res = await authServices.login(payload);
      const { data, message } = res ?? {};
      toast.success(message);

      const { accessToken, user } = data ?? {};
      localStorage.setItem("accessToken", accessToken);
      setUser(user);

      // Gọi luôn /permissions để có data ngay
      const permRes = await authServices.getPremiss();
      useAuthStore.getState().setPermissions(permRes?.data?.permissions);

      return res;
    } catch (err) {
      throw err;
    }
  };

  // register
  const register = async (payload) => {
    try {
      const res = await authServices.register(payload);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // logout
  const logoutUser = async () => {
    setLogoutLoading(true);
    try {
      const res = await authServices.logout();
      const { message } = res ?? {};
      logout();
      toast.success(message);
    } catch (err) {
      throw err;
    } finally {
      setLogoutLoading(false);
    }
  };

  return {
    user,
    login,
    register,
    logout: logoutUser,
    logoutLoading,
  };
}
