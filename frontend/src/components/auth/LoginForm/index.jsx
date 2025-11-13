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
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/layout/Header/logo";
import Loading from "@/app/(private)/loading";
import GoogleAuthButton from "../GoogleAuthButton";
import { useSearchParams } from "next/navigation";
import InputOTPForm from "../otp";
export default function LoginForm({ className, ...props }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
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
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const { error, message } = err ?? {};
      const { code, fields } = error ?? {};
      if (code === "VALIDATION_ERROR" && fields) {
        Object.entries(fields).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      } else {
        const { code, details } = error ?? {};
        if (details) {
          toast.error(details);
        } else {
          toast.error(message);
        }
      }
    }
  };
  if (loading) return <Loading />;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Logo />
            {/* <h1 className="text-xl font-bold">Chào mừng đến với Bee IT.</h1> */}
            <div className="text-center text-sm mt-5">
              Bạn chưa có tài khoản ?
              <Link
                href="/register"
                className="underline underline-offset-4 ml-1"
              >
                Đăng Ký.
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} placeholder="m@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {!token && (
              <>
                <Button type="submit" className="w-full">
                  Đăng Nhập
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-1">
                  <GoogleAuthButton />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
      {token && <InputOTPForm token={token} />}
    </div>
  );
}
