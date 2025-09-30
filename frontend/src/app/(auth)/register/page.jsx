// đăng ký
import AuthGuard from "@/components/auth/AuthGuard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Login() {
  return (
    <div>
      <AuthGuard>
        <RegisterForm />
      </AuthGuard>
    </div>
  );
}
