import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";
import Loading from "@/app/(private)/loading"; // Import component Loading của bạn

export default function Login() {
  return (
    <div>
      <AuthGuard>
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
      </AuthGuard>
    </div>
  );
}
