"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Loading from "@/app/(private)/loading";

/**
 * AuthGuard Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Children components
 * @param {boolean} props.requireAuth - true: yêu cầu đăng nhập (default), false: chặn nếu đã đăng nhập (cho login/register)
 * @param {string} props.redirectTo - URL redirect (default: "/login" nếu requireAuth, "/" nếu !requireAuth)
 */
export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = null 
}) {
  const { isLogin, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Đợi auth store init xong
    if (authLoading) {
      return;
    }

    const defaultRedirect = requireAuth ? "/login" : "/";

    if (requireAuth) {
      // Bảo vệ routes yêu cầu đăng nhập
      // Nếu chưa đăng nhập, redirect về login
      if (!isLogin) {
        router.push(redirectTo || defaultRedirect);
        return;
      }
    } else {
      // Chặn người đã đăng nhập vào login/register
      // Nếu đã đăng nhập, redirect về home
      if (isLogin) {
        router.push(redirectTo || defaultRedirect);
        return;
      }
    }

    // Cho phép render children
    setIsChecking(false);
  }, [isLogin, authLoading, router, requireAuth, redirectTo]);

  // Hiển thị loading khi đang check auth hoặc đang init
  if (authLoading || isChecking) {
    return <Loading />;
  }

  // Kiểm tra điều kiện cuối cùng
  if (requireAuth && !isLogin) {
    return <Loading />;
  }
  if (!requireAuth && isLogin) {
    return <Loading />;
  }

  return <>{children}</>;
}
