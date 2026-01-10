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

  // login (Step 1: Request OTP)
  const login = async (payload) => {
    try {
      const res = await authServices.login(payload);
      const { data, message } = res ?? {};
      toast.success(message);
      return res; // Trả về để component lấy TokenOTP
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
        toast.error("Lỗi xác thực: Không nhận được token");
        return;
      }
      
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      
      const permRes = await authServices.getPermissions();
      useAuthStore.getState().setPermissions(permRes?.data?.permissions);
      
      // Redirect sau khi login thành công dựa trên role
      // Role 1: Super Admin, 2: Admin, 3: Moderator/Leader -> Dashboard
      if (user?.role_id === 1 || user?.role_id === 2 || user?.role_id === 3) {
         router.push("/admin/dashboard");
      } else {
         // Role 4: Member, 5: Guest -> Homepage
         router.push("/");
      }
      
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
      const permRes = await authServices.getPermissions();
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
