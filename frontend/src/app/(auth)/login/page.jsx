import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div>
      <AuthGuard>
        <LoginForm />
      </AuthGuard>
    </div>
  );
}
