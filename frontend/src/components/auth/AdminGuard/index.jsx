"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Loading from "@/app/(private)/loading";
import { toast } from "sonner";

/**
 * AdminGuard Component
 * Chỉ cho phép Admin (role_id = 2) và Super Admin (role_id = 1) vào trang admin
 */
export default function AdminGuard({ children }) {
  const { isLogin, user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Đợi auth store init xong
    if (authLoading) {
      return;
    }

    // Nếu chưa đăng nhập, redirect về login
    if (!isLogin || !user) {
      toast.error("Bạn cần đăng nhập để truy cập trang quản trị");
      router.push("/login");
      return;
    }

    // Kiểm tra role_id: 1 = Super Admin, 2 = Admin
    const roleId = user.role_id || user.roleId;

    // Chỉ cho phép role_id = 1 (Super Admin) hoặc role_id = 2 (Admin)
    if (roleId !== 1 && roleId !== 2) {
      toast.error("Bạn không có quyền truy cập trang quản trị.");
      router.push("/");
      return;
    }

    // Cho phép render children
    setIsChecking(false);
  }, [isLogin, user, authLoading, router]);

  // Hiển thị loading khi đang check auth hoặc đang init
  if (authLoading || isChecking) {
    return <Loading />;
  }

  // Kiểm tra điều kiện cuối cùng
  if (!isLogin || !user) {
    return <Loading />;
  }

  const roleId = user.role_id || user.roleId;
  if (roleId !== 1 && roleId !== 2) {
    return <Loading />;
  }

  return <>{children}</>;
}
