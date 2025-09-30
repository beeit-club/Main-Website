import AuthGuard from "@/components/auth/AuthGuard";
import InputOTPForm from "@/components/auth/otp";

export default function OTP({ params }) {
  return (
    <div>
      <AuthGuard>
        <InputOTPForm token={params.token} />
      </AuthGuard>
    </div>
  );
}
