"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuthHook } from "@/hooks/useAuth";
import { loginSchema } from "@/validation/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useState } from "react";
import Logo from "@/components/layout/Header/logo";
import Loading from "@/app/(private)/loading";
import GoogleAuthButton from "../GoogleAuthButton";
import InputOTPForm from "../otp";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpToken = searchParams.get("token");
  
  const { login } = useAuthHook();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await login(data);
      const { TokenOTP } = res?.data ?? {};
      if (TokenOTP) {
        // Cập nhật URL thay vì state
        router.push(`/login?token=${TokenOTP}`);
      }
    } catch (err) {
      const { error, message } = err ?? {};
      const { code, fields } = error ?? {};
      if (code === "VALIDATION_ERROR" && fields) {
        Object.entries(fields).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        toast.error(message || "Đã xảy ra lỗi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearToken = () => {
    router.push("/login");
  };

  if (loading) return <Loading />;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <div className="text-center text-sm mt-5">
            {otpToken ? (
              <span className="font-semibold text-primary">Xác minh OTP</span>
            ) : (
              <>
                Bạn chưa có tài khoản?
                <Link
                  href="/register"
                  className="underline underline-offset-4 ml-1"
                >
                  Đăng Ký.
                </Link>
              </>
            )}
          </div>
        </div>

        {!otpToken ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} placeholder="m@example.com" type="email" />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Tiếp tục với Email
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  Hoặc
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-1">
                <GoogleAuthButton />
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <InputOTPForm token={otpToken} />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearToken}
              className="text-xs"
            >
              Dùng email khác
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}