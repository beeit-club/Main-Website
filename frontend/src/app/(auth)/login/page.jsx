import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div>
      Login
      <AuthGuard>
        <LoginForm />
      </AuthGuard>
    </div>
  );
}
