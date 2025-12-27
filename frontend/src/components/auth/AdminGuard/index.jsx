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
    console.log("=== AdminGuard Debug ===");
    console.log("authLoading:", authLoading);
    console.log("isLogin:", isLogin);
    console.log("user object:", user);
    console.log("user.role_id:", user?.role_id);
    console.log("user.roleId:", user?.roleId);
    console.log("Full user keys:", user ? Object.keys(user) : "no user");

    // Đợi auth store init xong
    if (authLoading) {
      console.log("Still loading auth...");
      return;
    }

    // Nếu chưa đăng nhập, redirect về login
    if (!isLogin || !user) {
      console.log("Not logged in or no user, redirecting to login");
      toast.error("Bạn cần đăng nhập để truy cập trang quản trị");
      router.push("/login");
      return;
    }

    // Kiểm tra role_id: 1 = Super Admin, 2 = Admin
    const roleId = user.role_id || user.roleId;
    console.log("Final roleId value:", roleId);
    console.log("roleId type:", typeof roleId);
    console.log("roleId === 1:", roleId === 1);
    console.log("roleId === 2:", roleId === 2);
    console.log("roleId !== 1 && roleId !== 2:", roleId !== 1 && roleId !== 2);

    // Chỉ cho phép role_id = 1 (Super Admin) hoặc role_id = 2 (Admin)
    if (roleId !== 1 && roleId !== 2) {
      console.log("Access denied - roleId is not 1 or 2");
      toast.error("Bạn không có quyền truy cập trang quản trị.");
      router.push("/");
      return;
    }

    console.log("Access granted - roleId is 1 or 2");
    // Cho phép render children
    setIsChecking(false);
  }, [isLogin, user, authLoading, router]);

  // Hiển thị loading khi đang check auth hoặc đang init
  if (authLoading || isChecking) {
    return <Loading />;
  }

  // Kiểm tra điều kiện cuối cùng
  if (!isLogin || !user) {
    console.log("Final check: Not logged in or no user");
    return <Loading />;
  }

  const roleId = user.role_id || user.roleId;
  console.log("Final render check - roleId:", roleId);
  if (roleId !== 1 && roleId !== 2) {
    console.log("Final check: Access denied");
    return <Loading />;
  }

  console.log("Final check: Access granted, rendering children");

  return <>{children}</>;
}
