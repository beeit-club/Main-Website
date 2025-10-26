"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // đúng cho app router
import { useAuthStore } from "@/stores/authStore";

export default function AuthGuard({ children }) {
  const { isLogin } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLogin) {
      router.push("/"); // redirect nếu chưa login
    }
  }, [isLogin, router]);

  // Optional: show loading trước khi xác nhận login
  if (isLogin) return <p>Loading...</p>;

  return <>{children}</>;
}
