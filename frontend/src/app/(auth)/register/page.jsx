// đăng ký
import AuthGuard from "@/components/auth/AuthGuard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      {/* requireAuth={false} để chặn người đã đăng nhập */}
      <AuthGuard requireAuth={false}>
        <RegisterForm />
      </AuthGuard>
    </div>
  );
}
