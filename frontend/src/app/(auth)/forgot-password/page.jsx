import AuthGuard from "@/components/auth/AuthGuard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div>
      {/* requireAuth={false} để chặn người đã đăng nhập */}
      <AuthGuard requireAuth={false}>
        <ForgotPasswordForm />
      </AuthGuard>
    </div>
  );
}
