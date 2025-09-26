"use client";
import { useEffect } from "react";
import { decodeJWT } from "@/lib/jwt";
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/services/auth";

export function useAuthInit() {
  const { setUser, setPermissions, logout, isLogin, permissions, user } =
    useAuthStore();
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        // 2. Gọi /auth/me để lấy dữ liệu mới nhất
        const res = await authServices.getPremiss();
        setPermissions(res?.data?.permissions);
        setUser(res?.data?.userData);
      } catch (err) {
        console.error("Auth init error:", err);
        // logout(); // nếu token hết hạn hoặc lỗi → logout
      }
    };

    initAuth();
  }, [setUser, setPermissions, logout]);
}
