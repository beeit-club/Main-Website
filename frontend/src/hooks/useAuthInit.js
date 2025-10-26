"use client";
import { useEffect } from "react";
// import { decodeJWT } from "@/lib/jwt"; // Bạn không dùng cái này nên tôi ẩn đi
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/services/auth";

export function useAuthInit() {
  // Lấy các action từ store
  const { setUser, setPermissions, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        logout(); // <-- SỬA Ở ĐÂY: Nếu không có token, gọi logout()
        return; // logout() sẽ tự động set isLoading: false
      }

      try {
        // 2. Gọi /auth/me để lấy dữ liệu mới nhất
        const res = await authServices.getPremiss();
        setPermissions(res?.data?.permissions);
        setUser(res?.data?.userData); // <-- setUser() sẽ set isLoading: false
      } catch (err) {
        console.error("Auth init error:", err);
        logout(); // <-- SỬA Ở ĐÂY: nếu token hết hạn hoặc lỗi → logout()
      }
    };

    initAuth();

    // Các dependency này là hàm static của Zustand,
    // nên useEffect này sẽ chỉ chạy 1 lần duy nhất khi app mount
  }, [setUser, setPermissions, logout]);
}
