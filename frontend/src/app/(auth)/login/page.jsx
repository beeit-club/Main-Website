import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import Loading from "@/app/(private)/loading";

export default function Login() {
  return (
    <div>
      {/* requireAuth={false} để chặn người đã đăng nhập */}
      <AuthGuard requireAuth={false}>
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
      </AuthGuard>
    </div>
  );
}
