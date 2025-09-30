"use client";
import { authServices } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { useAuthStore } = require("@/stores/authStore");
import { toast } from "sonner";
export function useAuthHook() {
  const { user, setUser, logout } = useAuthStore();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  // login
  const login = async (payload) => {
    try {
      const res = await authServices.login(payload);
      const { data, message } = res ?? {};
      toast.success(message);
      const { TokenOTP } = data ?? {};
      if (!TokenOTP) {
        toast.error("Đăng nhập thất bại");
        return;
      }
      const url = `/otp/${TokenOTP}`;
      router.push(url);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // register
  const registerF = async (payload) => {
    try {
      const res = await authServices.register(payload);
      const { data, message } = res ?? {};
      toast.success(message);
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
  const sendOtp = async (payload) => {
    try {
      const res = await authServices.sendOtp(payload);
      const { data, message } = res ?? {};
      toast.success(message);
      const { accessToken, user } = data ?? {};
      if (!accessToken) {
        toast.error("lỗi vui lòng thử lại");
        router.push("/login");
        return;
      }
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      const permRes = await authServices.getPremiss();
      useAuthStore.getState().setPermissions(permRes?.data?.permissions);
      return res;
    } catch (err) {
      throw err;
    }
  };
  const loginGoogle = async (payload) => {
    try {
      const res = await authServices.loginGoogle(payload);
      const { data, message } = res ?? {};
      toast.success(message);
      const { accessToken, user } = data ?? {};
      if (!accessToken) {
        toast.error("lỗi vui lòng thử lại");
        router.push("/login");
        return;
      }
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      const permRes = await authServices.getPremiss();
      useAuthStore.getState().setPermissions(permRes?.data?.permissions);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    user,
    login,
    registerF,
    logout: logoutUser,
    logoutLoading,
    sendOtp,
    loginGoogle,
  };
}
